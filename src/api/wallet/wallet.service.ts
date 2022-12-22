import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { APP_EVENTS } from "src/events";
import { UserDTO } from "src/interfaces";
import { generateId } from "src/utilities";
import { BankDetailDocument, BankDetails } from "./schemas/bankDetails.schema";
import { Wallet, WalletDocument } from "./schemas/wallet.schema";
import { WalletHelpers } from "./wallet.helper";

@Injectable()
export class WalletService {
  private logger = new Logger();

  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,

    @InjectModel(BankDetails.name)
    private bankWalletDetails: Model<BankDetailDocument>,

    private walletHelper: WalletHelpers,

    private eventEmitter: EventEmitter2
  ) {}

  @OnEvent(APP_EVENTS.UserActivated)
  async createWallet(payload: UserDTO) {
    const wallet = await this.walletHelper.createWallet(payload.id);
    return wallet;
  }

  async getUserWallet(userId: string) {
    const walletResponse = await this.walletHelper.getUserWalletNew(userId);

    let newlyCreated = false;

    if (!walletResponse.wallet) {
      // retry wallet creation
      walletResponse.wallet = await this.walletHelper.createWallet(userId);
      newlyCreated = Boolean(walletResponse.wallet);
    }

    if (!walletResponse.wallet) {
      throw new NotFoundException("No wallet found for user");
    }

    if (newlyCreated) {
      return this.getUserWallet(userId);
    }

    return walletResponse;
  }

  getSingleWithdrawalRequest() {
    //
  }

  getWithdrawalRequests() {
    //
  }

  async getWallets() {
    const wallets = await this.walletModel.find().limit(100).lean().exec();

    return wallets;
  }

  makeWithdrawal(userId: string, amount: number) {
    //
  }

  approveWithdrawal(requestId: string) {
    //
  }
}
