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
const AdminEmailSender = ({ phone, email, orderId, cartItems }) => {
  let items =
    cartItems.length &&
    cartItems.map(
      (item) =>
        `
       <div style=" flex: 1;
              margin: 5px !important;
              min-width: 270px;
              max-width: 270px;
              height: 350px;
              padding: 30px 0px !important;
              display: flex;
              flex-direction: column !important;
              align-items: center !important;
              gap: 20px;
              justify-content: center;
              background-color: #b8a06a !important;

            <div style="height: 80%;
                  width: 80%;
                  object-fit: cover;">
              <img src="${item.imageUrl[0]}" alt="${
          item.name
        }" style=" width: 100%;
                      height: 100%;
                      z-index: 2;"/>
            </div>
            <div style=" width: 80%;
                      gap: 10px;
                      color: #000 !important;">
                        <h4 style="font-weight: 800;
                        color: #000 !important;">Product name: ${item.name}</h4>
                         <h4 style="font-weight: 600;
                        color: #000 !important;">Product price: ${
                          item.price
                        }</h4>
                         <h4 style="font-weight: 600;
                        color: #000 !important;">Product quantity: ${
                          item.quantity
                        }</h4>
                        <h4 style="font-weight: 600;
                        color: #000 !important;">Product color: ${
                          item.colorName
                        }</h4>
                        <h4 style="font-weight: 600;
                        color: #000 !important;">Product Size: ${item.size}</h4>
                        ${
                          item.type
                            ? `<h4 style="font-weight: 600;
                        color: #000 !important;">Product Neck Type: ${item.type}</h4>`
                            : null
                        }
            </div>
       </div>
        `
    );
  items =
    items &&
    items.reduce((accumulator, currentValue) => accumulator + currentValue);
  //   console.log(items);
  const options = {
    from: `Kaizen Brand 🛍️ <${process.env.CONTACT}>`,
    to: process.env.CONTACT,
    subject: "You have a new order 🛍️",
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
              From Kaizen Brand 🛍️
            </p>
            <div style="font-size: .9rem;">
              <p>Customer's Email: <b>${email}</b></p>
              <p>Customer's Phone: <b>${phone}</b></p>
              <p>Customer's Order ID: <i>${orderId}</i></p>
            </div>
            <div style="">
            <h2 style="text-align: center;">Customer's Order Summary</h2>
            ${items}
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
export default AdminEmailSender;
