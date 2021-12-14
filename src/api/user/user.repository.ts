import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { generateId } from "src/utilities";
import { User, UserDocument } from "./schemas/user.schema";


@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async createUser(dto: Partial<User>) {
    const userData: Partial<User> = {
      id: generateId(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      hashedPassword: dto.hashedPassword,
      activated: true,
    };

    const user = await this.userModel.create(userData);

    return user || null;
  }

  async findOne(identifier: string, filterQuery: FilterQuery<UserDocument> | null = null): Promise<UserDocument> {
    const user = await this.userModel.findOne(filterQuery || {
      $or: [
        { id: identifier },
        { email: identifier }
      ]
    }).exec();

    return user || null;
  }

  async findUsers(filterQuery: FilterQuery<UserDocument> | null = null, limit = 100, skip = 0) {
    const users = await this.userModel
      .find(filterQuery || {})
      .limit(limit)
      .sort({ _id: 'asc' })
      .exec();

    return users;
  }

  async updateUserDetails(id: string, updates): Promise<boolean> {
    const data = await this.userModel.updateMany({ id }, { ...updates });

    if (data?.modifiedCount !== 1) {
      return false;
    }

    return true;
  }
}