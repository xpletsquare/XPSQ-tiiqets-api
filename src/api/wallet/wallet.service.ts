import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { APP_EVENTS } from "src/events";
import { UserDTO } from "src/interfaces";
import { generateId } from "src/utilities";
import { BankDetailDocument, BankDetails } from "./schemas/bankDetails.schema";
import { EventRepository } from "../event/event.repository";
import { TicketPurchaseRepository } from "../purchase_ticket/ticket_purchase.repository";
import { TicketPurchaseHelper } from "../purchase_ticket/helper.service";
import { Wallet, WalletDocument } from "./schemas/wallet.schema";
import { WalletHelpers } from "./wallet.helper";
import { WithdrawalRequestStatus } from "./schemas/withdrawal.schema";
import { PaystackService } from "../common/providers/paystack.service";
import { BankDetailsDTO } from "./dtos/bankDetails.dto";

@Injectable()
export class WalletService {
  private logger = new Logger();

  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,

    @InjectModel(BankDetails.name)
    private bankWalletDetails: Model<BankDetailDocument>,
    private walletHelper: WalletHelpers,
    private eventEmitter: EventEmitter2,
    private ticketRepository: TicketPurchaseRepository,
    private ticketHelper: TicketPurchaseHelper,
    private eventRepository: EventRepository,
    private paystackService: PaystackService
  ) {}

  @OnEvent(APP_EVENTS.UserActivated)
  async createWallet(payload: UserDTO) {
    const wallet = await this.walletHelper.createWallet(payload.id);
    return wallet;
  }

  async getUserWallet(userId: string) {
    const availableBalance = await this.calculateAllAvailableBalance(userId);
    const ledgerBalance = await this.calculateAllLedgerBalance(userId);
    const withdrawalRequest = await this.getUserWithdrawalRequests(userId);

    return { availableBalance, ledgerBalance, withdrawalRequest };
  }

  async getSingleWithdrawalRequest(id: string) {
    const withdrawalRequest = await this.walletHelper.findOneWithdrawalRequest(id);
    if (!withdrawalRequest) {
      throw new NotFoundException(`No withdrawal request found with id ${id}`);
    }
    return withdrawalRequest.toObject();
  }

  async getUserWithdrawalRequests(userId: string) {
    const withdrawalRequests = await this.walletHelper.findWithdrawalRequests({ userId }, null);
    return withdrawalRequests;
  }

  async getWallets() {
    const wallets = await this.walletModel.find().limit(100).lean().exec();

    return wallets;
  }

  async makeWithdrawal(userId: string, amount: number) {
    const currentWithdrawRequest = await this.walletHelper.findOneWithdrawalRequest(null, {
      status: WithdrawalRequestStatus.PENDING_REVIEW,
      user: userId
    });
    if (currentWithdrawRequest) {
      throw new BadRequestException("cannot make new request until the current open request is settled");
    }
    const balance = await this.calculateAllAvailableBalance(userId);
    if (amount > balance.balance) {
      throw new BadRequestException("wallet balance too low for this request");
    }
    const withdrawalRequest = await this.walletHelper.createWithdrawalRequest(userId, amount);
    return withdrawalRequest;
  }

  async approveWithdrawal(requestId: string, adminId: string) {
    const withdrawRequest = await this.walletHelper.findOneWithdrawalRequest(requestId)
    const accountData = await this.walletHelper.findOneAccountDetails(null, { user: withdrawRequest.user, recipient: { $exists: true } })
    if (!accountData) {
      throw new BadRequestException("cannot approve request until the user adds an account");
    }
    const transactionResponse = await this.paystackService.initiateTransfer(accountData.recipient, 'withdrawal', withdrawRequest.withdrawalReference, withdrawRequest.amount)
    const isRequestApproved = await this.walletHelper.updateWithdrawalEventStatus(requestId, WithdrawalRequestStatus.PENDING, adminId);
    if (!isRequestApproved) {
      throw new BadRequestException("error approving withdrawal");
    }
    return transactionResponse
  }

  async denyWithdrawal(requestId: string, adminId: string) {
    const isRequestApproved = await this.walletHelper.updateWithdrawalEventStatus(requestId, WithdrawalRequestStatus.DECLINED, adminId);
    if (!isRequestApproved) {
      throw new BadRequestException("error declining withdrawal");
    }
    return 'request denied'
  }

  async listBanks() {
    const banks = await this.paystackService.listBanks();
    return banks;
  }

  async verifyBank(accountData: Partial<BankDetailsDTO>) {
    const data = await this.paystackService.verifyBank(accountData.accountNumber, accountData.bankCode);
    return data;
  }

  async createTransferRecipient(userId: string, accountData: Partial<BankDetailsDTO>) {
    const account: Partial<BankDetailsDTO> = { ...accountData };
    const data = await this.paystackService.createTransferRecipient(account.accountNumber, account.bankCode, account.accountName);
    if (!data) {
      throw new BadRequestException("error creating transfer recipient");
    }
    account['recipient'] = data.recipient_code;
    account['user'] = userId;
    const bankDetails = await this.walletHelper.createBankAccount(userId, account);
    return bankDetails;
  }

  /**
   * Calculates the user ledger balance
   * @param {string} userId user id
   */
  async calculateAllLedgerBalance(userId: string) {
    const userEvents = await this.eventRepository.findEvents({
      author: userId,
      status: "ACTIVE"
    }, null)
    const eventIds = userEvents.map((data) => {
      return data.id;
    })
    const allPurchasedTickets = await this.ticketRepository.find({
      eventId: { $in: eventIds },
      paid: true,
      refunded: false,
      cost: { $gt: 0 }
    }, null);

    let purchasedTicketsSum = 0;
    let totalFeeCharged = 0;
    allPurchasedTickets.forEach(data => {
      purchasedTicketsSum += data.cost;
      totalFeeCharged += this.ticketHelper.calculateFeeForPurchase(data.cost);
    })

    console.log(purchasedTicketsSum);

    return {
      totalFeeCharged,
      totalPurchasedTickets: purchasedTicketsSum,
      balance: purchasedTicketsSum - totalFeeCharged
    };
  }

  /**
   * Calculates the user available balance
   * @param {string} userId user id
   */
  async calculateAllAvailableBalance(userId: string) {
    // Get all completed events
    const userEvents = await this.eventRepository.findEvents({
      author: userId,
      status: "INACTIVE"
    }, null)

    // Get IDs from completed event data
    const eventIds = userEvents.map((data) => {
      return data.id;
    })
    // Get paid tickets for events data fetched
    const allPurchasedTickets = await this.ticketRepository.find({
      eventId: { $in: eventIds },
      paid: true,
      refunded: false,
      cost: { $gt: 0 }
    }, null);

    // Get withdrawals
    const withdrawalData = await this.walletHelper.findWithdrawalRequests({
      status: WithdrawalRequestStatus.FULFILLED,
      userId
    })


    let purchasedTicketsSum = 0;
    let totalFeeCharged = 0;
    let withdrawnAmount = 0;
    // calculate total ticket purchase and fee
    allPurchasedTickets.forEach(data => {
      purchasedTicketsSum += data.cost;
      totalFeeCharged += this.ticketHelper.calculateFeeForPurchase(data.cost);
    })
    withdrawalData.forEach(data => {
      withdrawnAmount += data.amount
    })

    console.log(purchasedTicketsSum);

    return {
      totalFeeCharged,
      totalPurchasedTickets: purchasedTicketsSum,
      withdrawnAmount,
      balance: purchasedTicketsSum - (totalFeeCharged + withdrawnAmount)
    };
  }
}
