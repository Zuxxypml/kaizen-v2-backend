import nodemailer from "nodemailer";
const Email = (options) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
  });
  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
  });
};
// send email
const EmailSender = ({ email, orderId, cartItems }) => {
  let items =
    cartItems.length &&
    cartItems.map(
      (item) =>
        `<div>
                <p>Product Name: ${item.name}</p>
                <p>Product Price: ${item.price}</p>
                <p>Product Quantity: ${item.quantity}</p>
                </div>`
    );
  items =
    items &&
    items.reduce((accumulator, currentValue) => accumulator + currentValue);
  //   console.log(items);
  const options = {
    from: `Kaizen Brand 🛍️ <${process.env.CONTACT}>`,
    to: email,
    subject: "Message From Kaizen Brand 🛍️",
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
            <p style="font-weight: 800; font-size: 1.2rem; padding: 0 30px">
              From Kaizen Brand 🛍️
            </p>
            <div style="font-size: .8rem; margin: 0 30px">
              <p>Our Email: <b>${process.env.CONTACT}</b></p>
              <p>Our Phone: <b>${process.env.PHONE}</b></p>
              <p>Your Order ID: <i>${orderId}</i></p>
              <p>Message: <i>${process.env.MESSAGE}</i></p>
            </div>
            <div style="">
            <h4>Your Cart</h4>
            <p>
            ${items}
            </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html> 
        `,
  };
  Email(options);
};
export default EmailSender;
