import { Injectable } from "@nestjs/common";
import { UserDTO } from "src/interfaces";
import { MailgunService } from "../common/providers/mailgun.service";
import {
  TicketPurchase,
  TicketPurchased,
} from "../purchase_ticket/schemas/ticket_purchase.schema";
import { generateLoginAlertEmail } from "./inline-templates/login.email";
import { generatePurchaseReceiptEmail } from "./inline-templates/purchase-receipt.email";
import { generateTicketEmail } from "./inline-templates/ticket.email";
import { generateUserActivationEmail } from "./inline-templates/userActivation.email";
import { generateWelcomeEmail } from "./inline-templates/welcome.email";

import MailComposer from "nodemailer/lib/mail-composer";
import { EventTicketDocument } from "../tickets/schemas/ticket.schema";

@Injectable()
export class EmailService {
  constructor(private mailgunService: MailgunService) {}

  async sendActivationOTP(user: UserDTO, otp: number) {
    const email = generateUserActivationEmail(user, otp);
    const sent = await this.mailgunService.sendMail({
      message: email,
      recipients: [user.email],
      isHtml: true,
      subject: "Activate Account - Uzu Ticket",
      sender: "Uzu Ticket <verify@uzuticket.com>",
    });

    return sent || null;
  }

  async sendActivationSuccess(firstName: string, email: string) {
    //
  }

  async sendWelcomeEmail(user) {
    const email = generateWelcomeEmail(user);
    const sent = await this.mailgunService.sendMail({
      message: email,
      recipients: [user.email],
      isHtml: true,
      subject: "Welcome to Uzu Ticket",
      sender: "Uzu Ticket <welcome@uzuticket.com>",
    });

    return sent || null;
  }

  async sendLoginAlert(user) {
    const email = generateLoginAlertEmail(user);
    const sent = await this.mailgunService.sendMail({
      message: email,
      recipients: ["jonesbgabriel@gmail.com"],
      isHtml: true,
      subject: "Login Alert - Uzu Ticket",
      sender: "Uzu Ticket <alerts@uzuticket.com>",
    });

    return sent || null;
  }

  async sendPasswordChangeAlert(firstName: string, email: string) {
    //
  }

  async sendPasswordResetPin(
    firstName: string,
    email: string,
    resetPin: number
  ) {
    //
  }

  async sendPurchaseConfirmation(
    eventName: string,
    payload: Partial<TicketPurchase>,
    eventImage: string,
    isTicket: boolean
  ) {
    const html = await generatePurchaseReceiptEmail(
      eventName,
      payload,
      eventImage,
      isTicket
    );
    const sent = await this.mailgunService.sendMail({
      message: html,
      recipients: [payload?.userEmail],
      isHtml: true,
      subject: isTicket
        ? `${eventName} Ticket Details `
        : `Thanks for your Ticket Purchase - Uzu Ticket`,
      sender: "Uzu Ticket <purchases@uzuticket.com>",
    });
    return sent || null;
    // console.log('mail sent')
  }

  async sendTicketToUser(ticketDetails: TicketPurchased) {
    if (!ticketDetails.userEmail) {
      return;
    }

    const html = await generateTicketEmail(ticketDetails);

    const sent = await this.mailgunService.sendMail({
      message: html,
      recipients: [ticketDetails?.userEmail],
      isHtml: true,
      subject: `${ticketDetails?.event?.title} Ticket Details `,
      sender: "Uzu Tickets <ticket@uzuticket.com>",
    });

    return sent || null;
  }
}
