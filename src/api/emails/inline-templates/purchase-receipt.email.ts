import { EventTicketPurchase } from "src/api/event/schemas/event-ticket.schema";
import { TicketPurchase } from "src/api/purchase_ticket/schemas/ticket_purchase.schema";
import { formatCurrency, getQRCode, getQRCodeToFile } from "../../../utilities";
import {v2 as cloudinary} from 'cloudinary';



const generateTicketPurchaseCategoryRow = (
  purchaseSummary: EventTicketPurchase[]
) => {
  let htmlContent = ``;

  purchaseSummary.forEach((summary) => {
    const priceForQuantity = summary.pricePerUnit * summary.amountToPurchase;
    const price = formatCurrency(priceForQuantity);

    htmlContent += `
    <div class="flex-between border-bottom" style="width: 100%; margin: 10px 0; display: flex; justify-content: space-between; border-bottom: 1px solid lightgray; padding: 24px 0;">
    <span style="display: inline-block; max-width: 80%;"> 
      <span style="text-transform: capitalize">${summary.name} </span>
      <span class="lighter" style="opacity: 0.5; font-size: 18px; display: inline-block; max-width: 70%;"> x ${summary.amountToPurchase}</span>
    </span>
    <span class="price" style="font-weight: 600; font-size: 20px; display: inline-block; max-width: 70%; padding-left: 8px">  ${price} </span>
  </div>

    `;
  });

  return htmlContent;
};

export const generatePurchaseReceiptEmail = async (
  eventName: string,
  payload: Partial<TicketPurchase>,
  eventImage: string,
) => {
  const purchaseHTMLRows = generateTicketPurchaseCategoryRow(
    payload.ticketSummary as EventTicketPurchase[]
  );

  const totalCost = formatCurrency(payload.cost);

  console.log({payload})

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  console.log(payload);
  const imagePath = await getQRCodeToFile(payload.id, "qrImage")


  const imageUrl = await cloudinary.uploader
    .upload(imagePath, {
      folder: "qrcode",
      use_filename: false,
    })
    .then(result=>{
      console.log(result.url);
      return result.url;
    })
    .catch(err => console.log({err}));

    console.log(imagePath, imageUrl)

  // generate qr code
 
  // const qr = getQRCode("uzu tickets")
  //   .then( res => {
  //     console.log(res);
  //     return res;
  //   })
  //   .catch( err => console.log(err));


  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        *{
          box-sizing: border-box;
          padding: 0;
          margin: 0;
        }
        .item-sec{
          padding: 0px 3em;
        }
        @media screen and (max-width: 400px) {
          .item-sec{
          padding: 0px 10px;
        }
        }
      </style>
    </head>

    <body style="padding: 0px 10px 10vh 10px; background-color: rgb(243, 243, 243); color: #1f1f1f; font-size: 1.1em; ">
      <main style="max-width: 500px; margin: 1em auto; background-color: white; box-shadow: 0px 0px 20px  lightgray; padding: 0px;">
        <header style="background-color: #0E2615; padding: 10px 10px; max-width: 700px; margin: auto;"> <img style="padding: 20px" width="100px" src="https://res.cloudinary.com/drof5sggk/image/upload/v1684667924/assets/Asset_1_rf9cb4.png" alt="logo"></header>

        <!-- banner -->

        <section class="item-sec" style="max-width: 700px; margin: 0px auto; background-color: white; ">
       
        <div style="margin-top: 20px; background-color: grey; width: 100%; height: 150px; border-radius: 10px; background-image: url('${eventImage}'); background-size: cover;">

        </div>
        <div class="message" style="margin: 1em 0;">Thank you for purchasing tickets from Uzu Tickets.</div>

        <div class="order-card" style="margin: 1em 0; border: 1px solid lightgray; padding: 2em;">
          <div class="title" style="margin: 1em 0; font-weight: 700; font-size: 1em;">Order Summary</div>

          <div class="flex-between border-bottom" style="margin: 1em 0; display: flex; justify-content: space-between; border-bottom: 1px solid lightgray; padding: 1em 0;">
            <span style="display: inline-block; max-width: 70%;">Event</span> <br>
            <span style="display: inline-block; max-width: 70%; font-weight: 600; padding-left: 1em">
              ${eventName}
            </span>
          </div>

    
          ${purchaseHTMLRows}
        

          <!-- rows -->
    
          <div class="flex-between" style="margin: 24px 0; display: flex; justify-content: space-between;">
            <span style="display: inline-block; max-width: 70%;">Total</span> <br>
            <span class="total" style="font-weight: 700; font-size: 30px; display: inline-block; max-width: 70%; padding-left: 2em">${totalCost}</span>
          </div>
        </div>

        <div style="margin:10px 0; text-align: center; font-size: 16px; color: grey;">Present this QR code at the entry to validate your ticket</div>
    
        <div style="width: 100%; display: flex; justify-content: center;">
          <img src="${imageUrl}" alt="Ticket QR code" style="width: 300px; margin: auto;">
          </div>

          <div style="margin:10px 0; text-align: center; font-size: 16px; color: grey;">Ticket ID: ${payload.id}</div>

        <div class="footer" style="margin: 1em 0; margin-top: 40px; padding-bottom: 60px; opacity: 0.5; font-size: 0.8em;">
          <div style="margin: 1em 0; text-align: center;">This email was intended for ${payload.userEmail}. If you received this by mistake or have any questions, please reach out to us on
          support@uzutickets.com.</div>
    
          <div style="margin: 1em 0; text-align: center;">&copy; 2023 Uzu Ticket</div>
        </div>
      </section>
    </body>
  </html>
  `;
};
