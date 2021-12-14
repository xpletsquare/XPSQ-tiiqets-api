import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { FilterQuery } from "mongoose";
import { APP_EVENTS } from "src/events";
import { UserDTO, UserWithActivationPin } from "src/interfaces";
import { createJWTWithPayload, generateId, generatePin, hashPassword } from "src/utilities";
import { CacheService } from "../common/providers/cache.service";
import { CreateTempUserDTO } from "./dtos/createTempUser.dto";
import { CreateUserDTO } from "./dtos/createUser.dto";
import { UpdateUserDTO } from "./dtos/updateUser.dto";
import { User, UserDocument } from "./schemas/user.schema";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private eventEmitterClient: EventEmitter2,
    private cacheService: CacheService
  ) { }

  private async getUser(idOrEmail: string, filterQuery: FilterQuery<UserDocument> | null = null) {
    return this.userRepository.findOne(idOrEmail, filterQuery);
  }

  async getUsers(filters = null) {
    const users = await this.userRepository.findUsers(filters);

    if (!users?.length) {
      throw new NotFoundException('Users not found');
    }

    return users.map(user => user.toDto());
  }

  async getSingleUser(idOrEmail: string) {
    const user = await this.getUser(idOrEmail);

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user.toDto();
  }

  async updateUserInfo(identifier: string, updates: UpdateUserDTO) {
    const userData = await this.getUser(identifier);

    if (!userData) {
      throw new NotFoundException('Invalid user');
    }

    return this.userRepository.updateUserDetails(userData.id, updates);
  }

  async createTempUser(dto: CreateTempUserDTO) {
    const existingUser = await this.getUser('', {
      $or: [{ email: dto.email.toLowerCase() }, { phone: dto.phone.toLowerCase() }],
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with email/phone');
    }

    const tempuser: Partial<User> = {
      id: generateId(),
      firstName: dto.firstName.toLowerCase(),
      lastName: dto.lastName.toLowerCase(),
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      hashedPassword: hashPassword(dto.password),
      activated: false
    };

    const userWithPin: UserWithActivationPin = {
      user: tempuser,
      activationPin: generatePin()
    }

    this.eventEmitterClient.emit(APP_EVENTS.UserCreated, userWithPin)

    return tempuser;
  }

  async saveActivatedUser(dto: CreateUserDTO) {

    const existingUser = await this.getUser('', {
      $or: [{ email: dto.email.toLowerCase() }, { phone: dto.phone.toLowerCase() }],
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with email/phone');
    }

    const user = await this.userRepository.createUser(dto);

    if (!user) {
      throw new BadRequestException('Sorry, an error occurred');
    }

    const userDto = user.toDto();

    this.eventEmitterClient.emit(APP_EVENTS.UserActivated, userDto)

    return userDto;
  }

}
