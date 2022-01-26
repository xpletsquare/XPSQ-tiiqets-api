import { Module } from '@nestjs/common';
import { AuthModule } from './authentication/auth.module';
import { UserModule } from './user/user.module';
import { TicketPurchaseModule } from './purchase_ticket/ticket_purchase.module';

import { EventModule } from './event/event.module';

@Module({
  imports: [UserModule, AuthModule, EventModule, TicketPurchaseModule],
})
export class ApiModule {}
