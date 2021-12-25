import { Controller, Get, Post } from "@nestjs/common";
import { SuccessResponse } from "src/utilities/successMessage";



@Controller('admin')
export class AdminController {

  @Get('list')
  async listAdmins() {
    return new SuccessResponse('success', []);
  }

  @Post('new')
  async addAdmin() {
    return new SuccessResponse('success', []);
  }

  @Post('block-user')
  async blockUser() {
    return new SuccessResponse('success', []);
  }

  // Admin can approve withdrawals
  // Admin can see user information
}