import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { SuccessResponse } from "src/utilities/successMessage";
import { WalletService } from "./wallet.service";
import { BankDetailsDTO } from "./dtos/bankDetails.dto";
import { LoggedInGuard } from "../authentication/guards/loggedIn.guard";
import { AdminGuard } from "../authentication/guards/admin.guard";
import { WithdrawRequestDTO } from "./dtos/withdrawRequest.dto";

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

  @UseGuards(LoggedInGuard)
  @Post("banks/:userId")
  async addBankAccount(@Param("userId") userId: string, @Body() body: Partial<BankDetailsDTO>) {
    const bankDetails = await this.walletService.createTransferRecipient(userId, body);
    return new SuccessResponse("success", bankDetails);
  }

  @UseGuards(LoggedInGuard)
  @Post("withdraw/:userId")
  async makeWithdrawalRequest(@Param("userId") userId: string, @Body() body: WithdrawRequestDTO) {
    const withdrawRequest = await this.walletService.makeWithdrawal(userId, body.amount);
    return new SuccessResponse("success", withdrawRequest);
  }

  @UseGuards(AdminGuard)
  @Post("withdraw/approve/:requestId")
  async approveWithdrawalRequest(@Param("requestId") requestId: string, @Body() body: { userId: string }) {
    const withdrawRequest = await this.walletService.approveWithdrawal(requestId, body.userId);
    return new SuccessResponse("success", withdrawRequest);
  }

  @UseGuards(AdminGuard)
  @Post("withdraw/decline/:requestId")
  async declineWithdrawalRequest(@Param("requestId") requestId: string, @Body() body: { userId: string }) {
    const withdrawRequest = await this.walletService.denyWithdrawal(requestId, body.userId);
    return new SuccessResponse("success", withdrawRequest);
  }

  @Get("banks")
  async listBanks() {
    const banks = await this.walletService.listBanks();
    return new SuccessResponse("success", banks);
  }

  @Get("banks/verify")
  async verifyAccountDetail(@Body() body: Partial<BankDetailsDTO>) {
    const accountData = await this.walletService.verifyBank(body);
    return new SuccessResponse("success", accountData);
  }
}
