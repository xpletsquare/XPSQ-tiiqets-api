import { CacheTTL, Controller, Get, Param, Post } from "@nestjs/common";
import { SuccessResponse } from "src/utilities/successMessage";
import { UserService } from "./user.service";



@Controller('users')
export class UserController {

  constructor(
    private userService: UserService
  ) { }

  readonly responses = {
    success: 'success',
    registrationSuccess: 'user registeration successful',
    userFound: 'user data retrieved'
  }

  @CacheTTL(30) // Save response in cache for 30 seconds
  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();
    return new SuccessResponse(this.responses.success, users);
  }

  @Get(':id')
  async getUserInfo(@Param('id') id: string) {
    const userInfo = await this.userService.getSingleUser(id);
    return new SuccessResponse(this.responses.userFound, userInfo);
  }

}