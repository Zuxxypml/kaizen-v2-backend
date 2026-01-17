import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { generateAdminEmailTemplate } from "./emailTemplates/adminEmailTemplate.js";

dotenv.config();

// Email configuration from environment variables
const emailConfig = {
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.APP_PASSWORD,
  },
};

// Admin recipient email
const ADMIN_EMAIL = process.env.CONTACT;

// Create transporter (singleton instance)
let transporter = null;

/**
 * Initialize email transporter with error handling
 * @returns {Object} Nodemailer transporter instance
 */
const getTransporter = () => {
  if (!transporter) {
    validateEmailConfig();
    transporter = nodemailer.createTransport(emailConfig);
  }
  return transporter;
};

/**
 * Validate email configuration
 * @throws {Error} If required environment variables are missing
 */
const validateEmailConfig = () => {
  const requiredVars = ["MAIL_USERNAME", "APP_PASSWORD", "CONTACT"];
  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

/**
 * Send admin email notification for new order
 * @param {Object} metadata - Order metadata
 * @param {string} metadata.email - Customer email
 * @param {string} metadata.orderId - Order ID
 * @param {Array} metadata.cartItems - Items ordered
 * @param {number} metadata.subTotal - Subtotal
 * @param {number} metadata.totalPrice - Total price
 * @param {number} metadata.shippingFee - Shipping fee
 * @param {string} metadata.pickupLocation - Pickup location
 * @param {string} metadata.address - Delivery address
 * @returns {Promise<Object>} Email sending result
 */
export const AdminEmailSender = async (metadata) => {
  try {
    // Validate metadata
    if (!metadata || typeof metadata !== "object") {
      throw new Error("Invalid metadata provided");
    }

    const { email, orderId, cartItems } = metadata;

    // Validate required fields
    if (!email || !orderId || !Array.isArray(cartItems)) {
      throw new Error("Missing required fields: email, orderId, or cartItems");
    }

    if (cartItems.length === 0) {
      throw new Error("Cart items cannot be empty");
    }

    // Get formatted date
    const todayDate = new Date().toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Generate email template
    const htmlContent = generateAdminEmailTemplate(metadata, todayDate);

    // Email options
    const mailOptions = {
      from: `Kaizen Brand 🛍️ <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `New Order #${orderId} - Kaizen Brand 🛍️`,
      html: htmlContent,
      replyTo: email, // Allow admin to reply to customer
    };

    // Send email using async/await
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);

    console.log("Admin email sent successfully:", {
      messageId: info.messageId,
      orderId,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      messageId: info.messageId,
      orderId,
    };
  } catch (error) {
    console.error("Error sending admin email:", {
      error: error.message,
      orderId: metadata?.orderId,
      timestamp: new Date().toISOString(),
    });

    throw new Error(`Failed to send admin email: ${error.message}`);
  }
};

/**
 * Test email configuration
 * @returns {Promise<boolean>} True if connection is valid
 */
export const testEmailConnection = async () => {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    console.log("Email configuration is valid");
    return true;
  } catch (error) {
    console.error("Email configuration error:", error.message);
    throw new Error(`Email configuration invalid: ${error.message}`);
  }
};
