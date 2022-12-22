import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { APP_EVENTS } from "src/events";
import { generateId } from "src/utilities";
import { Event } from "../event/schemas/event.schema";
import { BankDetails, BankDetailDocument } from "./schemas/bankDetails.schema";
import {
  EventWallet,
  EventWalletDocument,
} from "./schemas/event-wallet.schema";
import { Wallet, WalletDocument } from "./schemas/wallet.schema";

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
    private eventModel: Model<Event>
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

    const bankDetails = await this.bankWalletDetails.create({
      id: generateId(),
      user: userid,
    });

    const wallet = await this.walletModel.create({
      id: generateId(),
      user: userid,
      balance: 0,
      bankDetailsId: bankDetails.id,
    });

    if (!wallet || !bankDetails) {
      throw new NotFoundException("");
    }

    this.logger.log(`Wallet (${wallet.id}) created for user (${wallet.user})`);

    return wallet.toObject();
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
