import { Injectable } from "@nestjs/common";


@Injectable()
export class EmailService {
  async sendActivationOTP(firstName: string, email: string, otp: number) { }

  async sendActivationSuccess(firstName: string, email: string) { }

  async sendWelcome(firstName: string, email: string) { }

  async sendLoginAlert(firstName: string, email: string) { }

  async sendPasswordChangeAlert(firstName: string, email: string) { }

  async sendPasswordResetPin(firstName: string, email: string, resetPin: number) { }
}