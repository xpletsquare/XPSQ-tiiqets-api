import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SuccessResponse } from 'src/utilities/successMessage';
import { AuthService } from './auth.service';
import { ActivateUserDTO } from './dtos/activateUser.dto';
import { LoginUserDTO } from './dtos/loginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('login')
  async loginUser(@Body() loginDetails: LoginUserDTO) {
    const data = await this.authService.loginUser(loginDetails)
    return new SuccessResponse('login successful', data);
  }

  @Post('admin/login')
  async loginAdmin(@Body() loginDetails: LoginUserDTO) {
    const data = await this.authService.loginAdmin(loginDetails);
    return new SuccessResponse('login successful', data);
  }

  @Get('activate')
  async activateUserWithOTP(@Body() body: ActivateUserDTO) {

  }

}