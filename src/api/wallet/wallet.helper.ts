import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { APP_EVENTS } from "src/events";
import { generateId } from "src/utilities";
import { Event } from "../event/schemas/event.schema";
import { BankDetails, BankDetailDocument } from "./schemas/bankDetails.schema";
import {
  EventWallet,
  EventWalletDocument,
} from "./schemas/event-wallet.schema";
import { Wallet, WalletDocument } from "./schemas/wallet.schema";
import { WithdrawalDocument, WithdrawalRequest, WithdrawalRequestStatus } from "./schemas/withdrawal.schema";
import { BankDetailsDTO } from "./dtos/bankDetails.dto";

@Injectable()
export class WalletHelpers {
  private readonly logger = new Logger();

  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,

    @InjectModel(EventWallet.name)
    private eventWalletModel: Model<EventWalletDocument>,

    @InjectModel(BankDetails.name)
    private bankWalletDetails: Model<BankDetailDocument>,

    @InjectModel(Event.name)
    private eventModel: Model<Event>,

    @InjectModel(WithdrawalRequest.name)
    private withdrawalRequestModel: Model<WithdrawalDocument>
  ) {}

  @OnEvent(APP_EVENTS.UserActivated)
  onUserActivated() {
    //
  }

  async createWallet(userid: string) {
    const exists = await this.walletModel.exists({ user: userid });

    if (exists) {
      return;
    }

    const wallet = await this.walletModel.create({
      id: generateId(),
      user: userid,
      balance: 0,
    });

    if (!wallet) {
      throw new NotFoundException("");
    }

    this.logger.log(`Wallet (${wallet.id}) created for user (${wallet.user})`);

    return wallet.toObject();
  }

  async createWithdrawalRequest(userId: string, amount: number) {
    const withdrawalRequest = await this.withdrawalRequestModel.create({
      id: generateId(),
      user: userId,
      status: WithdrawalRequestStatus.PENDING_REVIEW,
      withdrawalReference: generateId(),
      amount,
    });

    if (!withdrawalRequest) {
      throw new NotFoundException("cannot create withdrawal request");
    }

    this.logger.log(`Withdrawal request (${withdrawalRequest.id}) created for user (${withdrawalRequest.user})`);

    return withdrawalRequest.toObject();
  }

  async findOneWithdrawalRequest(
    identifier: string,
    filterQuery: FilterQuery<WithdrawalDocument> | null = null
  ): Promise<WithdrawalDocument> {
    const withdrawalRequest = await this.withdrawalRequestModel
      .findOne(filterQuery || { id: identifier })
      .exec();

    return withdrawalRequest || null;
  }

  async findOneAccountDetails(
    identifier: string,
    filterQuery: FilterQuery<BankDetailDocument> | null = null
  ): Promise<BankDetailDocument> {
    const bankDetails = await this.bankWalletDetails
      .findOne(filterQuery || { id: identifier })
      .exec();

    return bankDetails || null;
  }

  async findWithdrawalRequests(
    filterQuery: FilterQuery<WithdrawalDocument> | null = null,
    limit = 100,
    skip = 0
  ) {
    const withdrawalRequest = await this.withdrawalRequestModel
      .find(filterQuery || {})
      .limit(+limit)
      .skip(+skip)
      .sort({ createdAt: "asc" })
      .exec();

    return withdrawalRequest;
  }

  async updateWithdrawalEventStatus(
    withdrawalRequestId: string,
    status: string,
    adminId?: string
  ): Promise<boolean> {
    const withdrawalRequest = await this.findOneWithdrawalRequest(withdrawalRequestId);

    if (!withdrawalRequest) {
      throw new NotFoundException("cannot update withdrawal request");
    }
    if (adminId && withdrawalRequest.status !== WithdrawalRequestStatus.PENDING_REVIEW) {
      throw new BadRequestException("request past review stage")
    }

    const data = await this.withdrawalRequestModel.updateOne(
      { id: withdrawalRequest.id },
      {
        status,
        statusUpdatedAt: Date.now(),
        adminHandler: adminId
      }
    );

    return data?.modifiedCount >= 1;
  }

  async getUserEventsNotPaidOut(userId: string) {
    const userEvents = await this.eventModel.find({
      author: userId,
    });

    const userEventIds = userEvents.map((event) => event.id);

    const unpaidEventWallets = await this.eventWalletModel.find({
      paidOut: false,
      id: {
        $in: userEventIds,
      },
    });

    return unpaidEventWallets;
  }


  async createBankAccount(userId: string, accountData: Partial<BankDetailsDTO>) {
    const bankDetails = await this.bankWalletDetails.create({
      id: generateId(),
      user: userId,
      bankName: accountData.bankName,
      bankCode: accountData.bankCode,
      recipient: accountData.recipient,
      accountName: accountData.accountName,
      accountNumber: accountData.accountNumber
    });
    if (!bankDetails) {
      throw new NotFoundException("cannot save account details");
    }
    return bankDetails.toObject();
  }

  async getUserWalletNew(userId: string) {
    const [bankDetails, wallet, eventWallets] = await Promise.all([
      this.walletModel.findOne({
        user: userId,
      }),

      this.walletModel.findOne({
        user: userId,
      }),

      this.getUserEventsNotPaidOut(userId),
    ]);

    const data = {
      bankDetails,
      wallet: wallet.toObject(),
      eventWallets,
    };

    return data;
  }
}
