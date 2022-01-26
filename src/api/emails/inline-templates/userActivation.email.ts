import { UserDTO } from "src/interfaces"


export const generateUserActivationEmail = (user: Partial<UserDTO>, activationPin: number) => {

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
      <img src="https://res.cloudinary.com/dk07kf3yl/image/upload/v1640155875/temp/Fastes_way_to_puchase_tickets_ei12v2.png" alt="" style="width: 100%; border-radius: 3px; height: auto; object-fit: contain;">
  
      <div class="greeting" style="margin: 1em 0;">Hi <span style="text-transform: capitalize">${user.firstName}</span> </div>
  
      <div class="message" style="margin: 1em 0;">
        <p style="margin-top: 1em">Please use the pin below to activate your account.</p>
        <p style="margin-top: 1em; font-size: 2.5em; font-weight: bolder">${activationPin}</p>
        <p style="margin-top: 1em;">Please note that this expires in 2 hours</p>
      </div>
  
      <div class="footer" style="margin: 1em 0; margin-top: 50px; opacity: 0.5; font-size: 0.8em;">
        <div style="margin: 1em 0;">
          This email was intended for <span style="text-transform: capitalize">${user.firstName + ' ' + user.lastName} </span> (${user.email}). If you received this by mistake or have any questions, please reach out to us on
          support@xpsq.com.
        </div>
  
        <div style="margin: 1em 0;">XPSQ Nigeria</div>
      </div>
    </main>
  </body>
  </html>
  `
}