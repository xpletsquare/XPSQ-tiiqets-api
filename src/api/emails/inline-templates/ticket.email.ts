import { TicketPurchased } from "src/api/purchase_ticket/schemas/ticket_purchase.schema";
import { getQRCode } from "src/utilities"


export const generateTicketEmail = async (ticketDetails: TicketPurchased) => {
  const qrLink = await getQRCode(ticketDetails);
  const href = `http://127.0.0.1:5500/src/api/emails/templates/qr.html?qrcode=${qrLink}`

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>

    <body style="padding: 10vh 10vw; background-color: rgb(243, 243, 243);">
      <main style="max-width: 700px; margin: 1em auto; background-color: white; box-shadow: 0px 0px 20px  lightgray; padding: 3em;">
    
        <div class="greeting" style="margin: 1em 0;">Hello User</div>
    
        <div class="message border-bottom" style="margin: 1em 0; border-bottom: 1px solid lightgray;">
          Below are the ticket Details
        </div>
    
        <div class="border-bottom" style="margin: 1em 0; border-bottom: 1px solid lightgray;">
          <div style="margin: 1em 0;">Type</div>
          <div class="bolder" style="margin: 1em 0; font-weight: 700; font-size: 1.2em;">${ticketDetails.type}</div>
        </div>
    
        <div class="border-bottom" style="margin: 1em 0; border-bottom: 1px solid lightgray;">
          <div style="margin: 1em 0;">Event Name</div>
          <div class="bolder" style="margin: 1em 0; font-weight: 700; font-size: 1.2em;">${ticketDetails.event.title}</div>
        </div>
    
        <div class="border-bottom" style="margin: 1em 0; border-bottom: 1px solid lightgray;">
          <div style="margin: 1em 0;">Event Date</div>
          <div class="bolder" style="margin: 1em 0; font-weight: 700; font-size: 1.2em;">${ticketDetails.event.date}</div>
        </div>
    
        <div class="border-bottom" style="margin: 1em 0; border-bottom: 1px solid lightgray;">
          <div style="margin: 1em 0;">Venue</div>
          <div class="bolder" style="margin: 1em 0; font-weight: 700; font-size: 1.2em;">${ticketDetails.event.venue}</div>
        </div>
    
        <a href="${href}" style="background: darkblue; color: white; padding: 0.7em; border-radius: 4px">View QR</a>
    
        <div class="footer" style="margin: 1em 0; margin-top: 100px; opacity: 0.5; font-size: 0.8em;">
          <div style="margin: 1em 0;">This email was intended for ${ticketDetails.userEmail}. If you received this by mistake or have any questions, please reach out to us on
          support@xpsq.com.</div>
    
          <div style="margin: 1em 0;">
            &copy; 2021 Uzu Tickets
          </div>
        </div>
      </main>
    </body>
    </html>
  `
}