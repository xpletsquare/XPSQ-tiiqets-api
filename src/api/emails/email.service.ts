import { Injectable } from "@nestjs/common";
import { UserDTO } from "src/interfaces";
import { MailgunService } from "../common/providers/mailgun.service";
import { generateLoginAlertEmail } from "./inline-templates/login.email";
import { generateUserActivationEmail } from "./inline-templates/userActivation.email";
import { generateWelcomeEmail } from "./inline-templates/welcome.email";


@Injectable()
export class EmailService {
  constructor(
    private mailgunService: MailgunService
  ) { }

  async sendActivationOTP(user: UserDTO, otp: number) {
    const email = generateUserActivationEmail(user, otp);
    const sent = await this.mailgunService.sendMail({
      message: email,
      recipients: [user.email],
      isHtml: true,
      subject: 'Activate Account - XPSQ Tickets',
      sender: 'XPSQ Tickets <verify@xpsq.com>'
    })

    return sent || null;
  }

  async sendActivationSuccess(firstName: string, email: string) { }

  async sendWelcomeEmail(user) {
    const email = generateWelcomeEmail(user);
    const sent = await this.mailgunService.sendMail({
      message: email,
      recipients: [user.email],
      isHtml: true,
      subject: 'Welcome to XPSQ - XPSQ',
      sender: 'XPSQ Tickets <welcome@xpsq.com>'
    })

    return sent || null;
  }

  async sendLoginAlert(user) {
    const email = generateLoginAlertEmail(user);
    const sent = await this.mailgunService.sendMail({
      message: email,
      recipients: ['kenovienadu@gmail.com'],
      isHtml: true,
      subject: 'Login Alert - XPSQ',
      sender: 'XPSQ Tickets <alerts@xpsq.com>'
    })

    return sent || null;
  }

  async sendPasswordChangeAlert(firstName: string, email: string) { }

  async sendPasswordResetPin(firstName: string, email: string, resetPin: number) { }
}