import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HooksService } from './hooks.service';
import { SuccessResponse } from 'src/utilities/successMessage';


@ApiTags("Hooks")
@Controller('hooks')
export class HooksController {
  constructor ( 
    private hooksService: HooksService
  ) {}

  @Post("paystack")
  async paystackEventHandler(@Body() eventBody: any) {
    if (eventBody.event === 'transfer.success') {
      // handle successful event
      const message = await this.hooksService.handleSuccessfulTransfer(eventBody.data);
      return new SuccessResponse("log updated", message);
    } else if (eventBody.event === 'transfer.failed') {
      // handle failed event
      const message = await this.hooksService.handleFailedTransfer(eventBody.data);
      return new SuccessResponse("log updated", message);
    }
  }

}
