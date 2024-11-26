import crypto from "crypto";
import { EmailSender } from "../services/sendEmail.js";
import { InfoToAdminEmail } from "../services/InfoToAdminEmail.js";
import { AdminEmailSender } from "../services/AdminEmailSender.js";

export const handleWebHook = async (req, res) => {
  const receivedHash = req.headers["x-paystack-signature"];
  const secret = process.env.PAYSTACK_SECRET_KEY; // Your Paystack secret key
  const body = JSON.stringify(req.body); // Use raw body for signature verification

  // Validate the webhook signature
  const computedHash = crypto
    .createHmac("sha512", secret)
    .update(body)
    .digest("hex");

  if (computedHash !== receivedHash) {
    console.error("Invalid Paystack signature");
    return res.status(400).send("Invalid signature");
  }

  const event = req.body;

  // Validate the event payload
  if (!event || !event.data || !event.data.metadata) {
    console.error("Invalid webhook payload");
    return res.status(400).send("Invalid webhook payload");
  }
  if (event.data.status !== "success") {
    return res
      .status(200)
      .send("Webhook received but ignored (status not success)");
  }

  // Access the metadata passed from the frontend
  const metadata = event.data.metadata;
  console.log(event.data);
  console.log(event.data.metadata);

  // Process payment status
  if (event.data.status === "success") {
    console.log("Payment successful for Order ID:", metadata.orderId);
    // Handle successful payment logic here
    try {
      await EmailSender({ ...metadata });
      await InfoToAdminEmail({ ...metadata });
      await AdminEmailSender({ ...metadata });
      return res.status(200).json({ msg: "Order Email sent successfully" });
    } catch (error) {
      return res.status(404).json({ error: "Error ❌" });
    }
  }

  res.status(200).send("Webhook received successfully");
};
