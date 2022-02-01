import { Injectable } from "@nestjs/common";
import { UserDTO } from "src/interfaces";
import { MailgunService } from "../common/providers/mailgun.service";
import { TicketPurchase, TicketPurchased } from "../purchase_ticket/schemas/ticket_purchase.schema";
import { generateLoginAlertEmail } from "./inline-templates/login.email";
import { generatePurchaseReceiptEmail } from "./inline-templates/purchase-receipt.email";
import { generateTicketEmail } from "./inline-templates/ticket.email";
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
      sender: 'Uzu Tickets <verify@uzutickets.com>'
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
      sender: 'Uzu Tickets <welcome@uzutickets.com>'
    })

    return sent || null;
  }

  async sendLoginAlert(user) {
    const email = generateLoginAlertEmail(user);
    const sent = await this.mailgunService.sendMail({
      message: email,
      recipients: ['kenovienadu@gmail.com'],
      isHtml: true,
      subject: 'Login Alert - Uzu Tickets',
      sender: 'Uzu Tickets <alerts@uzutickets.com>'
    })

    return sent || null;
  }

  async sendPasswordChangeAlert(firstName: string, email: string) { }

  async sendPasswordResetPin(firstName: string, email: string, resetPin: number) { }

  async sendPurchaseConfirmation(eventName: string, payload: Partial<TicketPurchase>) {
    const html = generatePurchaseReceiptEmail(eventName, payload);

    const sent = await this.mailgunService.sendMail({
      message: html,
      recipients: ['kenovienadu@gmail.com'],
      isHtml: true,
      subject: 'Thanks for your Ticket Purchase - Uzu Tickets',
      sender: 'Uzu Tickets <purchases@uzutickets.com>'
    })

    return sent || null;
  }

  async sendTicketToUser(ticketDetails: TicketPurchased) {
    // if (!ticketDetails.userEmail) {
    //   return;
    // }

    const html = await generateTicketEmail(ticketDetails);

    const sent = await this.mailgunService.sendMail({
      message: html,
      recipients: ['kenovienadu@gmail.com'],
      isHtml: true,
      subject: `Ticket Details - Uzu Tickets - ${ticketDetails.id}`,
      sender: 'Uzu Tickets <purchases@uzutickets.com>'
    })

    return sent || null;
  }
}