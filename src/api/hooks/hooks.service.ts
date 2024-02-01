import { Injectable, Logger } from '@nestjs/common';
import { WalletHelpers } from '../wallet/wallet.helper';
import { WithdrawalRequestStatus } from '../wallet/schemas/withdrawal.schema';

@Injectable()
export class HooksService {

  constructor(
    private walletHelper: WalletHelpers
  ) {}
  readonly logger = new Logger();

  async handleSuccessfulTransfer(eventData) {
    const reference = eventData.reference;
    const withdrawalRequest = await this.walletHelper.findOneWithdrawalRequest(null, { withdrawalReference: reference })

    const isUpdated = await this.walletHelper.updateWithdrawalEventStatus(withdrawalRequest.id, WithdrawalRequestStatus.FULFILLED);
    if (isUpdated) {
      // TODO: Send withdrawal success email
    }
    this.logger.log(`WITHRAWAL REQUEST ${withdrawalRequest.id} fulfilled successfully`);
    return 'LOG UPDATED: SUCCESS!'
  }

  async handleFailedTransfer(eventData) {
    const reference = eventData.reference;
    const withdrawalRequest = await this.walletHelper.findOneWithdrawalRequest(null, { withdrawalReference: reference })

    const isUpdated = await this.walletHelper.updateWithdrawalEventStatus(withdrawalRequest.id, WithdrawalRequestStatus.FAILED);
    if (isUpdated) {
      // TODO: Send withdrawal failed email
    }
    this.logger.log(`WITHRAWAL REQUEST ${withdrawalRequest.id} failed`);
    return 'LOG UPDATED: FAILED!'
  }
}
