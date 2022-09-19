import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from "../common/common.module";
import { EmailModule } from "../emails/email.module";
import { User, UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserEventListeners } from "./user.events";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    CommonModule,
    EmailModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserEventListeners],
  exports: [UserService, UserRepository],
})
export class UserModule {}
