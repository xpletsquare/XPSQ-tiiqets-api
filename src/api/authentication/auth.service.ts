import { BadRequestException, Injectable } from "@nestjs/common";
import { createJWTWithPayload, generatePin, hashPassword } from "src/utilities";
import { CloudinaryHelper } from "src/utilities/cloudinary.service";
import { UserRepository } from "../user/user.repository";
import { ActivateUserDTO } from "./dtos/activateUser.dto";
import { LoginUserDTO } from "./dtos/loginUser.dto";
import { UserWithActivationPin, UserWithResetPin } from "src/interfaces";
import { CacheService } from "../common/providers/cache.service";
import { UserService } from "../user/user.service";
import { CreateUserDTO } from "../user/dtos/createUser.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { APP_EVENTS } from "src/events";


@Injectable()
export class AuthService {

  constructor(
    private userRepository: UserRepository,
    private cacheService: CacheService,
    private userService: UserService,
    private eventEmitterClient: EventEmitter2
  ) { }

  cloudinaryHelper = new CloudinaryHelper;

  async loginAdmin(loginDetails) {
    // logic goes here
  }

  async loginUser(loginDetails: LoginUserDTO) {
    const userInCache = await this.cacheService.get(loginDetails.email) as UserWithActivationPin;

    if (userInCache && !userInCache?.user?.activated) {
      throw new BadRequestException('Please check your email to activate your account');
    }

    const user = await this.userRepository.findOne(loginDetails.email);

    if (!user) {
      throw new BadRequestException('Incorrect Email/Password');
    }

    const validCredentials = user.checkPassword(loginDetails.password);

    if (!validCredentials) {
      throw new BadRequestException('Incorrect Email/Password');
    }

    return createJWTWithPayload(user.toDto());
  }

  async activateUser(dto: ActivateUserDTO) {
    const userInCache = await this.cacheService.get(dto.email) as UserWithActivationPin;

    if (!userInCache) {
      return new BadRequestException('Sorry, no user found');
    }

    if (userInCache.activationPin !== dto.otp) {
      return new BadRequestException('Incorrect OTP Entered');
    }

    const user = await this.userService.saveActivatedUser(userInCache.user as CreateUserDTO);

    await this.cacheService.del(dto.email);

    return createJWTWithPayload(user)
  }

  async requestPasswordReset(email: string) {
    const user = await this.userService.getSingleUser(email);

    if (user) {
      const payload: UserWithResetPin = {
        user: user,
        resetPin: generatePin()
      }

      this.eventEmitterClient.emit(APP_EVENTS.PasswordResetRequested, payload)
    }
  }

  async validateResetPin(email: string, pin: number) {
    const dataInCache = await this.cacheService.get('reset-' + email) as UserWithResetPin;

    if (!dataInCache || dataInCache.resetPin !== pin) {
      throw new BadRequestException('Invalid Reset Pin Entered');
    }

    return true;
  }

  async changePasswordWithPin(email: string, pin: number, password: string) {
    await this.validateResetPin(email, pin);

    const hashedPassword = hashPassword(password);
    const updated = await this.userService.updateUserInfo(email, { hashedPassword });

    if (!updated) {
      throw new BadRequestException('Sorry, an unknown error occurred');
    }

    return true;
  }

}