import { Module } from "@nestjs/common";
import { AuthModule } from "./authentication/auth.module";
import { UserModule } from "./user/user.module";


@Module({
  imports: [
    UserModule,
    AuthModule
  ]
})
export class ApiModule { }