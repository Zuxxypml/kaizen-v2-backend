import { AdminEmailSender } from "../services/AdminEmailSender.js";
import { InfoToAdminEmail } from "../services/InfoToAdminEmail.js";
import { EmailSender } from "../services/sendEmail.js";

export const handleAdminMail = async (req, res) => {
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
    await AdminEmailSender(
      email,
      orderId,
      cartItems,
      subTotal,
      totalPrice,
      shippingFee,
      pickupLocation,
      address
    );
    return res.status(200).json({ msg: "Your message sent successfully" });
  } catch (error) {
    return res.status(404).json({ error: "Error ❌" });
  }
};

export const handleCustomerDetailsToAdmin = async (req, res) => {
  try {
    const { email, orderId, address, phone, deliveryType, marketerCode } =
      req.body;
    await InfoToAdminEmail(
      phone,
      email,
      orderId,
      deliveryType,
      address,
      marketerCode
    );
    return res.status(200).json({ msg: "Your message sent successfully" });
  } catch (error) {
    return res.status(404).json({ error: "Error ❌" });
  }
};

export const handleCustomerMail = async (req, res) => {
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
    // console.log(req.body);
    EmailSender(
      email,
      orderId,
      cartItems,
      subTotal,
      totalPrice,
      shippingFee,
      pickupLocation,
      address
    );
    return res.status(200).json({ msg: "Your message sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Error ❌" });
  }
};
