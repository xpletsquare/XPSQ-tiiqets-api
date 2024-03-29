import { Body, CacheTTL, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { getQRCode } from 'src/utilities';
import { SuccessResponse } from 'src/utilities/successMessage';
import { AdminGuard } from '../authentication/guards/admin.guard';
import { UpdateUserDTO } from './dtos/updateUser.dto';
import { SingleUserResponse, UserListResponse } from './responses';
import { UserService } from './user.service';
import { LoggedInGuard } from '../authentication/guards/loggedIn.guard';
import { AuthUserInterceptor } from '../authentication/interceptors/authuser.interceptor';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  readonly responses = {
    success: 'success',
    registrationSuccess: 'user registeration successful',
    userFound: 'user data retrieved',
  };

  @ApiOkResponse({
    description: 'Users Retrieved',
    type: UserListResponse,
  })
  @UseGuards(AdminGuard)
  @CacheTTL(30) // Save response in cache for 30 seconds
  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();
    return new SuccessResponse(this.responses.success, users);
  }

  @ApiOkResponse({
    description: "User Retrieved",
    type: SingleUserResponse,
  })
  @Get(":id")
  async getUserInfo(@Param("id") id: string) {
    const userInfo = await this.userService.getSingleUser(id);
    return new SuccessResponse(this.responses.userFound, userInfo);
  }

  @Put(':id')
  @UseGuards(LoggedInGuard)
  async updateUserInfo(@Param('id') id: string, @Body() body: UpdateUserDTO, @Req() req) {
    const updatedUser = await this.userService.updateUserInfo(req.user.id, body);
    return new SuccessResponse('user details updated', updatedUser);
  }
}
