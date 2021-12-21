import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SuccessResponse } from 'src/utilities/successMessage';
import { CreateTempUserDTO } from '../user/dtos/createTempUser.dto';
import { AuthService } from './auth.service';
import { ActivateUserDTO } from './dtos/activateUser.dto';
import { CompletePasswordReset } from './dtos/completePasswordReset.dto';
import { LoginUserDTO } from './dtos/loginUser.dto';
import { ValidatePasswordResetPin } from './dtos/validateResetPin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('register')
  async registerUser(@Body() details: CreateTempUserDTO) {
    const data = await this.authService.registerUser(details)
    return new SuccessResponse('login successful', data);
  }

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

  @Post('activate')
  async activateUserWithOTP(@Body() body: ActivateUserDTO) {
    const response = await this.authService.activateUser(body);
    return new SuccessResponse('activation successful', response);
  }

  @Get('password-reset/:email')
  async getPasswordResetPin(@Param('email') email: string) {
    await this.authService.requestPasswordReset(email);
    return new SuccessResponse('success. please check your email');
  }

  @Post('validate-reset-pin')
  async validateResetPin(@Body() body: ValidatePasswordResetPin) {
    const token = await this.authService.validateResetPin(body.email, parseInt(body.otp));
    return new SuccessResponse('otp validation success', token);
  }

  @Post('complete-password-reset')
  async completePasswordReset(@Body() body: CompletePasswordReset) {
    await this.authService.changePasswordWithToken(body.token, body.password);
    return new SuccessResponse('validation successful')
  }

}