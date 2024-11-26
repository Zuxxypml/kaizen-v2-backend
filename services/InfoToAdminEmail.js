import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();
// Create a transporter object
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.MAIL_USERNAME}`,
    pass: `${process.env.APP_PASSWORD}`,
  },
});

// send email
export const InfoToAdminEmail = (metadata) => {
  return new Promise((resolve, reject) => {
    const { phone, email, orderId, deliveryType, address, marketerCode } =
      metadata;
    const options = {
      from: `Kaizen Brand 🛍️ <${process.env.CONTACT}>`,
      to: process.env.CONTACT,
      subject: "New order 🛍️🛍️ Customer Details",
      html: `
      <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Summary</title>
    </head>
    <body>
      <div style="width: 100%; background-color: #fff; padding: 3rem 0">
        <div style="max-width: 700px; background-color: white; margin: 0 auto">
          <div style="width: 100%; background-color: #fff; padding: 15px 0">
          <a href="${process.env.CLIENT_URL}" ><img
              src="https://i.ibb.co/5hdjR0z/kenny-1.png"
              style="width: 100%; height: 70px; object-fit: contain"
            /></a> 
          
          </div>
          <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
            <p style="font-weight: 800; font-size: 1.2rem;">
              Order 🛍️ Customer Details
            </p>
            <div style="font-size: .9rem;">
              <p>Customer's Email: <b>${email}</b></p>
              <p>Customer's Phone: <b>${phone}</b></p>
              <p>Customer's Order ID: <b>${orderId}</b></p>
              <p>Customer's Devlivery Option: <b>${deliveryType}</b> </p>
              <p>Customer's address: <b>${address}</b> </p>
              <p>Marketer's Code Used: <b>${marketerCode}</b> </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html> 
         `,
    };

    transporter.sendMail(options, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};
