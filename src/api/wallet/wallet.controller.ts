import { Controller, Get, Param } from "@nestjs/common";
import { SuccessResponse } from "src/utilities/successMessage";
import { WalletService } from "./wallet.service";

@Controller("wallet")
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  async getWallets() {
    const wallets = await this.walletService.getWallets();
    return new SuccessResponse("success", wallets);
  }

  @Get("user/:userId")
  async getUserWallet(@Param("userId") userId: string) {
    const wallet = await this.walletService.getUserWallet(userId);
    return new SuccessResponse("success", wallet);
  }
}
