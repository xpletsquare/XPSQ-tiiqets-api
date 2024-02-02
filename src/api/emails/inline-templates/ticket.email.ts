import { TicketPurchased } from "src/api/purchase_ticket/schemas/ticket_purchase.schema";
import { formatCurrency, getQRCode, getQRCodeToFile } from "src/utilities";
import { v2 as cloudinary } from "cloudinary";

export const generateTicketEmail = async (ticketDetails: TicketPurchased) => {
  // *********************************************************************** //
  //                                                                         //
  //                          Updated code base                              //
  //                                                                         //
  // *********************************************************************** //

  // const totalCost = formatCurrency(payload.cost);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // console.log(payload);
  const imagePath = await getQRCodeToFile(ticketDetails.id, "qrImage");

  const payload = ticketDetails;

  const imageUrl = await cloudinary.uploader
    .upload(imagePath, {
      folder: "qrcode",
      use_filename: false,
    })
    .then((result) => {
      return result.url;
    })
    .catch((err) => console.log({ err }));

  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
  <div marginheight="0" marginwidth="0" style="width:100%!important;margin:0;padding:0">
    
    
    
    <table cellpadding="0" cellspacing="0" border="0" valign="top" width="100%" align="center" style="width:100%;max-width:480px">
        <tbody><tr>
            <td valign="top" align="left" style="word-break:normal;border-collapse:collapse;font-family:'Circular','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;color:#555555">
                <center>
                    <div id="m_1108210264072164983main">
                        <table width="100%" height="50" cellpadding="0" cellspacing="0" style="border:none;margin:0px;border-collapse:collapse;padding:0px;width:100%;height:50px">
                            <tbody valign="middle" style="border:none;margin:0px;padding:0px">
                                <tr height="20" valign="middle" style="border:none;margin:0px;padding:0px;height:20px">
                                    <td colspan="3" height="20" valign="middle" style="border:none;margin:0px;padding:0px;height:20px"></td>
                                </tr>
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td width="6.25%" valign="middle" style="border:none;margin:0px;padding:0px;width:6.25%"></td>
                                    <td valign="middle" style="border:none;margin:0px;padding:0px">
                                        <a href="https://uzuticket.com" style="border:none;margin:0px;padding:0px;text-decoration:none" target="_blank" data-saferedirecturl="" jslog="32272; 1:WyIjdGhyZWFkLWY6MTc3NTkzMzAwNjkzNzEwMTMwNyIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsW11d; 4:WyIjbXNnLWY6MTc3NTkzMzAwNjkzNzEwMTMwNyIsbnVsbCxbXSxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxbXSxbXSxbXV0."><img src="https://res.cloudinary.com/drof5sggk/image/upload/v1694163216/assets/uzu-ticket-dark_zaldkv.png" width="" height="40" alt="" style="border:none;margin:0px;padding:0px;display:block;height:40px" class="CToWUd" data-bit="iit"></a>
                                    </td>
                                    <td width="6.25%" valign="middle" style="border:none;margin:0px;padding:0px;width:6.25%"></td>
                                </tr>
                                <tr height="20" valign="middle" style="border:none;margin:0px;padding:0px;height:20px">
                                    <td colspan="3" height="20" valign="middle" style="border:none;margin:0px;padding:0px;height:20px"></td>
                                </tr>
                            </tbody>
                        </table>
                        <table width="100%" cellpadding="0" cellspacing="0" style="border:none;margin:0px;border-collapse:collapse;padding:0px;width:100%">
                            <tbody valign="middle" style="border:none;margin:0px;padding:0px">
                                <tr height="28" valign="middle" style="border:none;margin:0px;padding:0px;height:28px">
                                    <td colspan="3" height="28" valign="middle" style="border:none;margin:0px;padding:0px;height:28px"></td>
                                </tr>
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td width="6.25%" valign="middle" style="border:none;margin:0px;padding:0px;width:6.25%"></td>
                                    <td valign="middle" style="border:none;margin:0px;padding:0px">
                                        <h2 align="center" style="border:none;margin:0px;padding:0px;font-family:Circular,'Helvetica Neue',Helvetica,Arial,sans-serif;text-decoration:none;color:rgb(85,85,85);font-size:30px;font-weight:bold;line-height:45px;letter-spacing:-0.04em;text-align:center">
                                                
  
                                            <span class="il">Hello ${payload.userFirstName}, </span>

                                        </h2>

                                        <h4 align="center">Your ticket is here.</h4>
                                    </td>
                                    <td width="6.25%" valign="middle" style="border:none;margin:0px;padding:0px;width:6.25%"></td>
                                </tr>
                                <tr height="16" valign="middle" style="border:none;margin:0px;padding:0px;height:16px">
                                    <td colspan="3" height="16" valign="middle" style="border:none;margin:0px;padding:0px;height:16px"></td>
                                </tr>
                            </tbody>
                        </table>
                        <table width="100%" cellpadding="0" cellspacing="0" style="border:none;margin:0px;border-collapse:collapse;padding:0px;width:100%">
                            <tbody valign="middle" style="border:none;margin:0px;padding:0px">
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td width="6.25%" valign="middle" style="width:6.25%;border:none;margin:0px;padding:0px"></td>
                                    <td valign="middle" style="border:none;margin:0px;padding:0px">
                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0px;padding:0px">
                                            <tbody>
                                                <tr>
                                                    <td align="left" style="border:none;margin:0px;padding:0px 0px 5px;font-family:Circular,'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:200;text-align:left;text-decoration:none;color:rgb(97,100,103);font-size:14px;line-height:20px">
                                                        <center style="border:none;margin:0px;padding:0px">
                                                          ${payload.event.date}
                                                          <center style="border:none;margin:0px;padding:0px"></center>
                                                        </center>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                       
                                    </td>
                                    <td width="6.25%" valign="middle" style="width:6.25%;border:none;margin:0px;padding:0px"></td>
                                </tr>
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td colspan="3" height="20" valign="middle" style="border:none;margin:0px;padding:0px;height:20px"></td>
                                </tr>
                            </tbody>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" style="border:none;margin:0px;border-collapse:collapse;padding:0px;width:100%">
                            <tbody valign="middle" style="border:none;margin:0px;padding:0px">
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td width="6.25%" valign="middle" style="width:6.25%;border:none;margin:0px;padding:0px"></td>
                                    <td valign="middle" style="border:none;margin:0px;padding:0px">
                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0px;padding:0px">
                                            <tbody>
                                                <tr>
                                                    <td align="left" style="border:none;margin:0px;padding:0px 0px 5px;font-family:Circular,'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:200;text-align:left;text-decoration:none;color:rgb(97,100,103);font-size:14px;line-height:20px">
                                                        <center style="border:none;margin:0px;padding:0px">
                                                         <img src= ${imageUrl} alt="ticket qr code"/>
                                                          <center style="border:none;margin:0px;padding:0px"></center>
                                                        </center>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                       
                                    </td>
                                    <td width="6.25%" valign="middle" style="width:6.25%;border:none;margin:0px;padding:0px"></td>
                                </tr>
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td colspan="3" height="20" valign="middle" style="border:none;margin:0px;padding:0px;height:20px"></td>
                                </tr>
                            </tbody>
                        </table>


                        <table width="100%" cellpadding="0" cellspacing="0" style="border:none;margin:0px;border-collapse:collapse;padding:0px;width:100%">
                            <tbody valign="middle" style="border:none;margin:0px;padding:0px">
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td width="6.25%" valign="middle" style="width:6.25%;border:none;margin:0px;padding:0px"></td>
                                    <td valign="middle" style="border:none;margin:0px;padding:0px">
                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0px;padding:0px">
                                            <tbody>
                                                <tr>
                                                    <td align="left" style="border:none;margin:0px;padding:0px 0px 5px;font-family:Circular,'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:200;text-align:left;text-decoration:none;color:rgb(97,100,103);font-size:14px;line-height:20px">
                                                        <table cellspacing="0" cellpadding="0" width="100%" bgcolor="#F7F7F7" style="margin:0px;padding:0px;background:rgb(247,247,247);border-collapse:collapse;width:100%">
                                                            <tbody>
                     


                                                                <tr>
                                                                    <td style="border-style:solid;border-width:1px;border-color:rgb(227,227,227)">
                                                                        <table cellspacing="0" cellpadding="0" width="100%" style="margin:0px;padding:0px;width:100%">
                                                                            <tbody>
                                                                                <tr height="10" valign="middle" style="border:none;margin:0px;padding:0px;height:10px">
                                                                                    <td colspan="4" height="10" valign="middle" style="border:none;margin:0px;padding:0px;height:10px;font-size:10px;line-height:10px"></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td width="5%" valign="middle" style="border:none;margin:0px;padding:0px;width:5%"></td>
                                                                                    <td valign="middle" style="font-weight:bold;font-family:'Circular','Helvetica Neue',Helvetica,Arial,sans-serif">
                                                                                        Your ticket
                                                                                    </td>
                                                                                    <td width="20%" valign="middle" style="text-align:right;width:20%;vertical-align:top;font-family:'Circular','Helvetica Neue',Helvetica,Arial,sans-serif">
                                                                                      NIL
                                                                                    </td>
                                                                                    <td width="5%" valign="middle" style="border:none;margin:0px;padding:0px;width:5%"></td>
                                                                                </tr>
                                                                                <tr height="10" valign="middle" style="border:none;margin:0px;padding:0px;height:10px">
                                                                                    <td colspan="4" height="10" valign="middle" style="border:none;margin:0px;padding:0px;height:10px;font-size:10px;line-height:10px"></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                
                                                                <tr>
                                                                    <td style="border-style:solid;border-width:1px;border-color:rgb(227,227,227)">
                                                                        <table cellspacing="0" cellpadding="0" width="100%" style="margin:0px;padding:0px;width:100%">
                                                                            <tbody>
                                                                                <tr height="10" valign="middle" style="border:none;margin:0px;padding:0px;height:10px">
                                                                                    <td colspan="4" height="10" valign="middle" style="border:none;margin:0px;padding:0px;height:10px;font-size:10px;line-height:10px"></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td width="5%" valign="middle" style="border:none;margin:0px;padding:0px;width:5%"></td>
                                                                                    <td valign="middle" style="font-weight:bold;font-family:'Circular','Helvetica Neue',Helvetica,Arial,sans-serif">
                                                                                        Usage
                                                                                    </td>
                                                                                    <td width="20%" valign="middle" style="text-align:right;width:20%;vertical-align:top;font-family:'Circular','Helvetica Neue',Helvetica,Arial,sans-serif">
                                                                                       This ticket admits ONE
                                                                                    </td>
                                                                                    <td width="5%" valign="middle" style="border:none;margin:0px;padding:0px;width:5%"></td>
                                                                                </tr>
                                                                                <tr height="10" valign="middle" style="border:none;margin:0px;padding:0px;height:10px">
                                                                                    <td colspan="4" height="10" valign="middle" style="border:none;margin:0px;padding:0px;height:10px;font-size:10px;line-height:10px"></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td width="6.25%" valign="middle" style="width:6.25%;border:none;margin:0px;padding:0px"></td>
                                </tr>
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td colspan="3" height="20" valign="middle" style="border:none;margin:0px;padding:0px;height:20px"></td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- start of event section -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="border:none; padding: 0px; margin: 0px; border-collapse: collapse;">
                          <tbody valign="middle">
                            <tr>
                              <td width="6.25%"></td>
                                <td align="left">
                                  <table>
                                    <tbody width="100%" cellpadding="0" cellspacing="0" style="border: none; padding: 0px; margin: 0px;">
                                      <tr>
                                        <td width="30%">
                                          <img width="100%" alt="banner" src="${payload.event?.image?.landscape}" />
                                        </td>
                                        <td width="70%" style="padding-right: 20px; padding-left:10px;"> <h3 style="font-weight: bold; font-size: 18px; line-height: 28px;">${payload?.event?.title}</h3></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              <td width="6.25%"></td>
                            </tr>
                          </tbody>
                        </table>
                        <!-- end of event section -->

                        <table width="100%" cellpadding="0" cellspacing="0" style="border:none;margin:0px;border-collapse:collapse;padding:0px;width:100%">
                            <tbody valign="middle" style="border:none;margin:0px;padding:0px">
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td width="6.25%" valign="middle" style="width:6.25%;border:none;margin:0px;padding:0px"></td>
                                    <td valign="middle" style="border:none;margin:0px;padding:0px">
                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0px;padding:0px">
                                            <tbody>
                                                <tr>
                                                    <td align="left" style="border:none;margin:0px;padding:0px 0px 5px;font-family:Circular,'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:200;text-align:left;text-decoration:none;color:rgb(97,100,103);font-size:14px;line-height:20px">
                                                        <center style="border:none;margin:0px;padding:0px"><b align="left" style="border:none;margin:0px;padding:0px;font-family:Circular,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;text-align:left;text-decoration:none;font-weight:bold">
                                                          Customer info:
                                                        </b></center>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0px;padding:0px">
                                            <tbody>
                                                <tr>
                                                    <td align="left" style="border:none;margin:0px;padding:0px 0px 5px;font-family:Circular,'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:200;text-align:left;text-decoration:none;color:rgb(97,100,103);font-size:14px;line-height:20px">
                                                        <center style="border:none;margin:0px;padding:0px"> 
                                                        ${payload.userFirstName}  ${payload.userLastName} | ${payload.userEmail} 
                                                        </center>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td width="6.25%" valign="middle" style="width:6.25%;border:none;margin:0px;padding:0px"></td>
                                </tr>
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td colspan="3" height="20" valign="middle" style="border:none;margin:0px;padding:0px;height:20px"></td>
                                </tr>
                            </tbody>
                        </table>
                       
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="border:none;margin:0px;border-collapse:collapse;padding:0px;width:100%">
                            <tbody valign="middle" style="border:none;margin:0px;padding:0px">
                                <tr height="22" valign="middle" style="border:none;margin:0px;padding:0px;height:32px">
                                    <td colspan="3" height="22" valign="middle" style="border:none;margin:0px;padding:0px;height:22px"></td>
                                </tr>
                            </tbody>
                        </table>
                        <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#F7F7F7" style="border:none;margin:0px;border-collapse:collapse;padding:0px;width:100%;background-color:rgb(247,247,247)">
                            <tbody valign="middle" style="border:none;margin:0px;padding:0px">
                                <tr height="25" valign="middle" style="border:none;margin:0px;padding:0px;height:25px">
                                    <td colspan="3" height="25" valign="middle" style="border:none;margin:0px;padding:0px;height:25px"></td>
                                </tr>
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td width="6.25%" valign="middle" style="border:none;margin:0px;padding:0px;width:6.25%"></td>
                                    <td valign="middle" style="border:none;margin:0px;padding:0px"><img src="https://res.cloudinary.com/drof5sggk/image/upload/v1694169795/assets/uzu-long-grey_pdalpk.png" width="auto" height="20" alt="" style="border:none;margin:0px;padding:0px;display:block;max-width:auto;width:auto;height:20px" class="CToWUd" data-bit="iit"></td>
                                    <td width="6.25%" valign="middle" style="border:none;margin:0px;padding:0px;width:6.25%"></td>
                                </tr>
                                <!-- space -->
                                <tr>
                                  <td colspan="3" style="height: 40px; border: none; margin: 0px; padding: 0px; "></td>
                                </tr>
                                <!-- footer message -->

                                <tr>
                                  <td width="6.25%" style="width: 6.25%;"></td>
                                  <td color="#C1C1C1" style="color: rgb(182, 182, 182);">This email was intended for ${payload.userEmail}.com. If you received this by mistake or have any questions, please reach out to us on support@uzuticket.com.</td>
                                  <td width="6.25%" style="width: 6.25%;"></td>
                                </tr>
                                <!-- end of footer message -->

                                <tr height="25" valign="middle" style="border:none;margin:0px;padding:0px;height:25px">
                                    <td colspan="3" height="25" valign="middle" style="border:none;margin:0px;padding:0px;height:25px"></td>
                                </tr>
                               
                                <tr height="12" valign="middle" style="border:none;margin:0px;padding:0px;height:12px">
                                    <td colspan="3" height="12" valign="middle" style="border:none;margin:0px;padding:0px;height:12px"></td>
                                </tr>
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td width="6.25%" valign="middle" style="border:none;margin:0px;padding:0px;width:6.25%"></td>
                                    <td align="center">

                                      <!-- socials -->
                                      <a href="https://tiktok.com/@uzu_ticket" target="_blank" style="margin-left: 6px; margin-right: 6px;"><img src="https://res.cloudinary.com/drof5sggk/image/upload/v1694164393/socials/tiktok_sgague.png" alt="tiktok"/></a>

                                      <a href="https://www.threads.net/@uzu_ticket" target="_blank" style="margin-left: 6px; margin-right: 6px;"><img src="https://res.cloudinary.com/drof5sggk/image/upload/v1694164393/socials/threads_gxuffi.png" alt="thread"/></a>

                                      <a href="https://www.instagram.com/uzu_ticket/" target="_blank" style="margin-left: 6px; margin-right: 6px;"><img src="https://res.cloudinary.com/drof5sggk/image/upload/v1694164393/socials/instagram_t6jav7.png" alt="instagram"/></a>

                                      <a href="https://twitter.com/Uzu_ticket" target="_blank" style="margin-left: 6px; margin-right: 6px;"><img src="https://res.cloudinary.com/drof5sggk/image/upload/v1694164393/socials/x_k4co52.png" alt="twitter"/></a>


                                      <a href="https://www.facebook.com/uzuticket" target="_blank" style="margin-left: 6px; margin-right: 6px;"><img src="https://res.cloudinary.com/drof5sggk/image/upload/v1694164393/socials/facebook_km1dbd.png" alt="facebook"/></a>

                                      <a href="https://www.linkedin.com/company/uzu-ticket" target="_blank" style="margin-left: 6px; margin-right: 6px;"><img src="https://res.cloudinary.com/drof5sggk/image/upload/v1694164393/socials/linkedin_amwanp.png" alt="Linkedin"/></a>

                                     
                                      <!-- end of socials -->
                                  
                                    </td>
                                    <td width="6.25%" valign="middle" style="border:none;margin:0px;padding:0px;width:6.25%"></td>
                                </tr>
                                <tr height="12" valign="middle" style="border:none;margin:0px;padding:0px;height:12px">
                                    <td colspan="3" height="12" valign="middle" style="border:none;margin:0px;padding:0px;height:32px"></td>
                                </tr>
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td width="6.25%" valign="middle" style="border:none;margin:0px;padding:0px;width:6.25%"></td>
                                    <td valign="middle" style="border:none;margin:0px;padding:0px">
                                        <hr bgcolor="#D1D5D9" style="border:none;margin:0px;padding:0px;height:1px;background-color:rgb(209,213,217)">
                                    </td>
                                    <td width="6.25%" valign="middle" style="border:none;margin:0px;padding:0px;width:6.25%"></td>
                                </tr>
                                <tr height="25" valign="middle" style="border:none;margin:0px;padding:0px;height:25px">
                                    <td colspan="3" height="25" valign="middle" style="border:none;margin:0px;padding:0px;height:25px"></td>
                                </tr>
                                
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td colspan="3" height="12" valign="middle" style="border:none;margin:0px;padding:0px;height:12px"></td>
                                </tr>
                                <tr valign="middle" style="border:none;margin:0px;padding:0px">
                                    <td width="6.25%" valign="middle" style="border:none;margin:0px;padding:0px;width:6.25%"></td>
                                    <td valign="middle" align="center" style="border:none;margin:0px;padding:0px;font-family:Circular,'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:200;text-align:left;text-decoration:none;color:rgb(136,137,140);line-height:1.65em;font-size:12px">
                                      <center>Copyright © <span class="il" style="margin-left:4px; margin-right: 4px; "><a href="https://uzuticket.com" target="_blank" style="text-decoration: none;">www.uzuticket.com</a></span> 2023 </center>
                                    </td>
                                    <td width="6.25%" valign="middle" style="border:none;margin:0px;padding:0px;width:6.25%"></td>
                                </tr>
                                

                                <tr height="20" valign="middle" style="border:none;margin:0px;padding:0px;height:20px">
                                    <td colspan="3" height="25" valign="middle" style="border:none;margin:0px;padding:0px;height:25px"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </center>
            </td>
        </tr>
    </tbody></table>
    
</div>

</body>
</html>
    `;
};
