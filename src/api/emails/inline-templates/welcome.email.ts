import { UserDTO } from "src/interfaces"


export const generateWelcomeEmail = (user: Partial<UserDTO>) => {
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
        <div class="greeting" style="margin: 1em 0;">Hi <span style="text-transform: capitalize">${user.firstName}</span> </div>
    
        <div class="message" style="margin: 1.4em 0;">
          <div style="margin: 1em 0;">Welcome to XPSQ</div>
        </div>
    
        <div class="footer" style="margin: 1.4em 0; margin-top: 100px; opacity: 0.5; font-size: 0.8em;">
          <div style="margin: 1.4em 0;">
            This email was intended for ${user.firstName + ' ' + user.lastName}  (${user.email}). 
            If you received this by mistake or have any questions, please reach out to us on
            support@xpsq.com.
          </div>
    
          <div style="margin: 1.4em 0;">
            &copy; 2021 Uzu Tickets
          </div>
        </div>
      </main>
    </body>
  </html>
  `
}