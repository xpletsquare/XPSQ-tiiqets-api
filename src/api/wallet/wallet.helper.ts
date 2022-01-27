import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { APP_EVENTS } from "src/events";
import { generateId } from "src/utilities";
import { BankDetails, BankDetailDocument } from "./schemas/bankDetails.schema";
import { EventWallet, EventWalletDocument } from "./schemas/event-wallet.schema";
import { Wallet, WalletDocument } from "./schemas/wallet.schema";


@Injectable()
export class WalletHelpers {

  private readonly logger = new Logger;

  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,

    @InjectModel(EventWallet.name)
    private eventWalletModel: Model<EventWalletDocument>,

    @InjectModel(BankDetails.name)
    private bankWalletDetails: Model<BankDetailDocument>
  ) { }

  @OnEvent(APP_EVENTS.UserActivated)
  onUserActivated() {

  }

  async createWallet(userid: string) {
    const exists = await this.walletModel.exists({ user: userid });

    if (exists) {
      return;
    }

    const bankDetails = await this.bankWalletDetails.create({
      id: generateId(),
      user: userid,
    })

    const wallet = await this.walletModel.create({
      id: generateId(),
      user: userid,
      balance: 0,
      bankDetailsId: bankDetails.id
    })

    if (!wallet || !bankDetails) {
      throw new NotFoundException('')
    }

    this.logger.log(`Wallet (${wallet.id}) created for user (${wallet.user})`);

    return wallet.toObject();
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
          as: "userInfo",
        }
      },
      { // ADD EVENT WALLETS THAT HAVENT BEEN PAID OUT
        $lookup: {
          from: 'eventwallet',
          localField: "id",
          foreignField: "event",
          as: "eventWallets",
          pipeline: [
            {
              $match: {
                paidOut: false
              }
            }
          ]
        }
      }
    ]).unwind("bankInfo", "userInfo").exec();

    const userWallet = wallets[0];

    return userWallet;
  }
}