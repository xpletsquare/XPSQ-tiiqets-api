import { BadRequestException, Injectable } from "@nestjs/common";
import {
  createJWTWithPayload,
  generatePin,
  hashPassword,
  verifyAndDecodeJWTToken,
} from "src/utilities";
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
import { CreateTempUserDTO } from "../user/dtos/createTempUser.dto";

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private cacheService: CacheService,
    private userService: UserService,
    private eventEmitterClient: EventEmitter2
  ) {}

  private readonly cloudinaryHelper = new CloudinaryHelper();

  async registerUser(details: CreateTempUserDTO) {
    const userInCache = (await this.cacheService.get(
      details.email
    )) as UserWithActivationPin;

    if (userInCache && userInCache?.user?.email) {
      throw new BadRequestException("User exists with the above email");
    }

    const data = await this.userService.createTempUser(details);
    return data;
  }

  async loginAdmin(loginDetails) {
    // logic goes here
  }

  async loginUser(loginDetails: LoginUserDTO) {
    const userInCache = (await this.cacheService.get(
      loginDetails.email
    )) as UserWithActivationPin;

    if (userInCache && !userInCache?.user?.activated) {
      throw new BadRequestException(
        "Please check your email to activate your account"
      );
    }

    const user = await this.userRepository.findOne(loginDetails.email);

    if (!user) {
      throw new BadRequestException("Incorrect Email/Password");
    }

    const validCredentials = user.checkPassword(loginDetails.password);

    if (!validCredentials) {
      throw new BadRequestException("Incorrect Email/Password");
    }

    this.eventEmitterClient.emit(APP_EVENTS.UserLogin, user.toDto());

    return createJWTWithPayload(user.toDto());
  }

  async activateUser(dto: ActivateUserDTO) {
    const userInCache = (await this.cacheService.get(
      dto.email
    )) as UserWithActivationPin;

    if (!userInCache) {
      throw new BadRequestException("Sorry, no user found");
    }

    if (userInCache.activationPin !== dto.otp) {
      throw new BadRequestException("Incorrect OTP Entered");
    }

    const user = await this.userService.saveActivatedUser(
      userInCache.user as CreateUserDTO
    );

    await this.cacheService.del(dto.email);

    return createJWTWithPayload(user);
  }

  async requestPasswordReset(email: string) {
    const user = await this.userService.getSingleUser(email);

    if (user) {
      const payload: UserWithResetPin = {
        user: user,
        resetPin: generatePin(),
      };

      console.log(payload);

      this.eventEmitterClient.emit(APP_EVENTS.PasswordResetRequested, payload);
    }
  }

  async validateResetPin(email: string, pin: number) {
    const dataInCache = (await this.cacheService.get(
      "reset-" + email
    )) as UserWithResetPin;

    if (!dataInCache || dataInCache.resetPin !== pin) {
      throw new BadRequestException("Invalid Reset Pin Entered");
    }

    const { token } = createJWTWithPayload(dataInCache.user);
    return token as string;
  }

  async changePasswordWithToken(token: string, password: string) {
    const tokenPayload = verifyAndDecodeJWTToken(token);

    if (!tokenPayload?.email) {
      throw new BadRequestException("Invalid token");
    }

    const hashedPassword = hashPassword(password);
    const updated = await this.userService.updateUserInfo(tokenPayload?.email, {
      password: hashedPassword,
    });

    if (!updated) {
      throw new BadRequestException("Sorry, an unknown error occurred");
    }

    return true;
  }
}
