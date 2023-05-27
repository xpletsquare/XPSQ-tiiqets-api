import { Module } from "@nestjs/common";
import { AuthModule } from "./authentication/auth.module";
import { UserModule } from "./user/user.module";
import { TicketPurchaseModule } from "./purchase_ticket/ticket_purchase.module";

import { EventModule } from "./event/event.module";
import { WalletModule } from "./wallet/wallet.module";
import { ScannerModule } from "./scanner/scanner.module";

@Module({
  imports: [
    UserModule,
    AuthModule,
    EventModule,
    TicketPurchaseModule,
    WalletModule,
    ScannerModule,


  ],
})
export class ApiModule {}
