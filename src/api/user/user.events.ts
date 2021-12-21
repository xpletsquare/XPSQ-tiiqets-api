import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { APP_EVENTS } from "src/events";
import { UserDTO, UserWithActivationPin, UserWithResetPin } from "src/interfaces";
import { CacheService } from "../common/providers/cache.service";
import { EmailService } from "../emails/email.service";
import { CreateUserDTO } from "./dtos/createUser.dto";


@Injectable()
export class UserEventListeners {
  constructor(
    private cacheService: CacheService,
    private emailService: EmailService
  ) { }

  @OnEvent(APP_EVENTS.UserCreated)
  async onUserSignup(payload: UserWithActivationPin) {
    console.log('use signup event called');
    // save user to cache
    const TWENTY_FOUR_HOURS = 60 * 60 * 24;
    await this.cacheService.set(payload.user.email, payload, TWENTY_FOUR_HOURS);

    // send activation email
    await this.emailService.sendActivationOTP(payload.user.firstName, payload.user.email, payload.activationPin)
  }

  @OnEvent(APP_EVENTS.UserActivated)
  async onUserActivated(payload: CreateUserDTO) {
    await this.cacheService.del(payload.email);
    await this.emailService.sendActivationSuccess(payload.firstName, payload.email);
    await this.emailService.sendWelcome(payload.firstName, payload.email);
  }

  @OnEvent(APP_EVENTS.UserLogin)
  async onUserLogin(payload: UserDTO) {
    await this.emailService.sendLoginAlert(payload.firstName, payload.email);
  }

  @OnEvent(APP_EVENTS.PasswordResetRequested)
  async onPasswordResetRequest(payload: UserWithResetPin) {
    const ONE_HOUR = 60 * 60 * 1;
    await this.cacheService.set(`reset-${payload.user.email}`, payload, ONE_HOUR);
    await this.emailService.sendPasswordResetPin(payload.user.firstName, payload.user.email, payload.resetPin);
  }
}