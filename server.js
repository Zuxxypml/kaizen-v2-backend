import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import EmailSender from "./services/sendEmail.js";
import AdminEmailSender from "./services/AdminEmailSender.js";
import InfoToAdminEmail from "./services/InfoToAdminEmail.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: `*` }));
const port = process.env.PORT || 5000;
// ****** SEND API
app.post("/send", async (req, res) => {
  try {
    const {
      email,
      orderId,
      cartItems,
      subTotal,
      totalPrice,
      shippingFee,
      pickupLocation,
      address,
    } = req.body;
    await EmailSender({
      email,
      orderId,
      cartItems,
      subTotal,
      totalPrice,
      shippingFee,
      pickupLocation,
      address,
    });
    res.json({ msg: "Your message sent successfully" });
  } catch (error) {
    res.status(404).json({ msg: "Error ❌" });
  }
});
app.post("/admin", async (req, res) => {
  try {
    const {
      email,
      orderId,
      cartItems,
      subTotal,
      totalPrice,
      shippingFee,
      pickupLocation,
      address,
      phone,
    } = req.body;
    await AdminEmailSender({
      email,
      orderId,
      cartItems,
      subTotal,
      totalPrice,
      shippingFee,
      pickupLocation,
      address,
      phone,
    });
    res.json({ msg: "Your message sent successfully" });
  } catch (error) {
    res.status(404).json({ msg: "Error ❌" });
  }
});
// Sends Customer Details to Admin
app.post("/adminCustomer", async (req, res) => {
  try {
    const { email, orderId, address, phone, deliveryType } = req.body;
    await InfoToAdminEmail({
      email,
      orderId,
      deliveryType,
      address,
      phone,
    });
    res.json({ msg: "Your message sent successfully" });
  } catch (error) {
    res.status(404).json({ msg: "Error ❌" });
  }
});
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
