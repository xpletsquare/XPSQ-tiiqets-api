import { Injectable, Logger } from "@nestjs/common";
import { SendMailOptions } from "src/interfaces";
import * as Mailgun from "mailgun-js";
import { CONFIG } from "src/config";

const mailer = Mailgun({
  apiKey: CONFIG.mailgun.apikey,
  domain: CONFIG.mailgun.domain,
  host: CONFIG.mailgun.host,
});

export interface MailData {
  from: string;
  to: string;
  subject: string;
  text: string;
}

@Injectable()
export class MailgunService {
  async sendMail(mailData: SendMailOptions) {
    try {
      const receivers = mailData.recipients.join(", ");

      const htmlOrText = mailData.isHtml ? "html" : "text";

      const data = {
        from: mailData.sender || "XPSQ Tickets <info@xpsq.com>",
        to: receivers,
        subject: mailData.subject,
        [htmlOrText]: mailData.message,
      };

      Logger.log(`SENDING EMAIL - ${data.to} - ${data.subject}`);

      const response = await mailer.messages().send(data);
      return response;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }
}
