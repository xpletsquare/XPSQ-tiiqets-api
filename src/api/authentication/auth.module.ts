import { Global, Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Global()
@Module({
  imports: [CommonModule, UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
