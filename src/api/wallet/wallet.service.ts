import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { APP_EVENTS } from "src/events";
import { UserDTO } from "src/interfaces";
import { generateId } from "src/utilities";
import { BankDetailDocument, BankDetails } from "./schemas/bankDetails.schema";
import { Wallet, WalletDocument } from "./schemas/wallet.schema";


@Injectable()
export class WalletService {

  private logger = new Logger;

  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,

    @InjectModel(BankDetails.name)
    private bankWalletDetails: Model<BankDetailDocument>
  ) { }

  @OnEvent(APP_EVENTS.UserActivated)
  async createWallet(payload: UserDTO) {
    const exists = await this.walletModel.exists({ user: payload.id });

    if (exists) {
      return;
    }

    const bankDetails = await this.bankWalletDetails.create({
      id: generateId(),
      user: payload.id,
    })

    const wallet = await this.walletModel.create({
      id: generateId(),
      user: payload.id,
      balance: 0,
      bankDetailsId: bankDetails.id
    })

    this.logger.log(`Wallet (${wallet.id}) created for user (${wallet.user})`)
  }

  async getUserWallet(userId: string) {

    const wallets = await this.walletModel.aggregate([
      {
        $match: {
          user: userId
        }
      },
      {
        $lookup: {
          from: 'bankdetails',
          localField: "bankDetailsId",
          foreignField: "id",
          as: "bankInfo"
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: "user",
          foreignField: "id",
          as: "userInfo"
        }
      }
    ]).unwind("bankInfo", "userInfo").exec();

    const userWallet = wallets[0];

    return userWallet;
  }

  getSingleWithdrawalRequest() { }

  getWithdrawalRequests() { }

  async getWallets() {
    const wallets = await this.walletModel.find().limit(100).lean().exec();
    return wallets;
  }

  makeWithdrawal(userId: string, amount: number) { }

  approveWithdrawal(requestId: string) { }
}