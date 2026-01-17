import crypto from "crypto";
import { EmailSender } from "../services/sendEmail.js";
import { InfoToAdminEmail } from "../services/InfoToAdminEmail.js";
import { AdminEmailSender } from "../services/AdminEmailSender.js";

export const handleWebHook = async (req, res) => {
  const receivedHash = req.headers["x-paystack-signature"];
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const body = JSON.stringify(req.body); // Use raw body for signature verification

  // Validate the webhook signature
  const computedHash = crypto
    .createHmac("sha512", secret)
    .update(body)
    .digest("hex");

  // Log for debugging
  console.log("🔐 Webhook Debug Info:");
  console.log("- Received Hash:", receivedHash ? "✅ Present" : "❌ Missing");
  console.log("- Secret Key:", secret ? "✅ Configured" : "❌ Missing");
  console.log(
    "- Hash Match:",
    computedHash === receivedHash ? "✅ YES" : "❌ NO"
  );

  if (computedHash !== receivedHash) {
    console.error("❌ Invalid Paystack signature");
    console.error("Expected:", computedHash);
    console.error("Received:", receivedHash);
    return res.status(400).send("Invalid signature");
  }

  const event = req.body;

  // Validate the event payload
  if (!event || !event.data || !event.data.metadata) {
    console.error("Invalid webhook payload");
    console.error("Event:", event);
    return res.status(400).send("Invalid webhook payload");
  }
  if (event.data.status !== "success") {
    console.log(
      "⚠️  Webhook received but status is not 'success':",
      event.data.status
    );
    return res
      .status(200)
      .send("Webhook received but ignored (status not success)");
  }

  // Access the metadata passed from the frontend
  const metadata = event.data.metadata;
  console.log("✅ Valid webhook received");
  console.log("📦 Order ID:", metadata.orderId);
  console.log("💰 Amount:", event.data.amount);
  console.log("📧 Email:", metadata.email);

  // Process payment status
  if (event.data.status === "success") {
    console.log("🎉 Payment successful for Order ID:", metadata.orderId);
    // Handle successful payment logic here
    try {
      await EmailSender({ ...metadata });
      await InfoToAdminEmail({ ...metadata });
      await AdminEmailSender({ ...metadata });
      console.log("✅ All emails sent successfully!");
      return res.status(200).json({ msg: "Order Email sent successfully" });
    } catch (error) {
      console.error("❌ Email sending error:", error.message);
      return res.status(404).json({ error: "Error ❌" });
    }
  }

  res.status(200).send("Webhook received successfully");
};
