import { EventTicketPurchase } from "src/api/event/schemas/event-ticket.schema";
import { TicketPurchase } from "src/api/purchase_ticket/schemas/ticket_purchase.schema";

const generateTicketPurchaseCategoryRow = (
  purchaseSummary: EventTicketPurchase[]
) => {
  let htmlContent = ``;

  purchaseSummary.forEach((summary) => {
    const priceForQuantity = summary.pricePerUnit * summary.amountToPurchase;

    htmlContent += `
      <div class="flex-between border-bottom" style="width: 100%; margin: 1em 0; display: flex; justify-content: space-between; border-bottom: 1px solid lightgray; padding: 1em 0;">
        <span style="display: inline-block; max-width: 70%;"> ${summary.name} <span class="lighter" style="opacity: 0.5; font-size: 0.8em; display: inline-block; max-width: 70%;">x ${summary.amountToPurchase}</span></span>
        <span class="price" style="font-weight: 700; font-size: 1em; display: inline-block; max-width: 70%;">N${priceForQuantity}</span>
      </div>
    `;
  });

  return htmlContent;
};

export const generatePurchaseReceiptEmail = (
  eventName: string,
  payload: Partial<TicketPurchase>
) => {
  const purchaseHTMLRows = generateTicketPurchaseCategoryRow(
    payload.ticketSummary as EventTicketPurchase[]
  );

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>

  <body style="padding: 10vh 10vw; background-color: rgb(243, 243, 243); color: #1f1f1f; font-size: 1.1em;">
    <main style="max-width: 700px; margin: 1em auto; background-color: white; box-shadow: 0px 0px 20px  lightgray; padding: 3em;">
  
      <div class="message" style="margin: 1em 0;">Thank you for purchasing tickets from Uzu Tickets.</div>
  
      <div class="order-card" style="margin: 1em 0; border: 1px solid lightgray; padding: 2em;">
        <div class="title" style="margin: 1em 0; font-weight: 700; font-size: 1em;">Order Summary</div>

        <div class="flex-between border-bottom" style="margin: 1em 0; display: flex; justify-content: space-between; border-bottom: 1px solid lightgray; padding: 1em 0;">
          <span style="display: inline-block; max-width: 70%;">Event</span>
          <span style="display: inline-block; max-width: 70%;">
            ${eventName}
          </span>
        </div>
  
        ${purchaseHTMLRows}
  
        <div class="flex-between" style="margin: 1em 0; display: flex; justify-content: space-between;">
          <span style="display: inline-block; max-width: 70%;">Total</span>
          <span class="total" style="font-weight: 700; font-size: 1.7em; display: inline-block; max-width: 70%;">N${payload.cost}</span>
        </div>
      </div>
  
      <div class="footer" style="margin: 1em 0; margin-top: 100px; opacity: 0.5; font-size: 0.8em;">
        <div style="margin: 1em 0;">This email was intended for user@gmail.com. If you received this by mistake or have any questions, please reach out to us on
        support@uzutickets.com.</div>
  
        <div style="margin: 1em 0;">&copy; 2021 Uzu Tickets</div>
      </div>
    </main>
  </body>
  </html>
  
  `;
};
