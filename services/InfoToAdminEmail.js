import dotenv from "dotenv";
import nodemailer from "nodemailer";

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
const CLIENT_URL = process.env.CLIENT_URL || "https://kaizenbrand.ng";

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
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

/**
 * Generate HTML template for customer info notification to admin
 * @param {Object} metadata - Customer order metadata
 * @returns {string} HTML email template
 */
const generateInfoToAdminTemplate = (metadata) => {
  const { phone, email, orderId, deliveryType, address, marketerCode } =
    metadata;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Customer Order Details</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 700px; margin: 0 auto; background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { width: 100%; padding: 20px 0; text-align: center; background-color: #b8a06a; }
    .header img { width: 100%; height: 70px; object-fit: contain; }
    .content { padding: 30px; }
    .content h2 { font-size: 1.3rem; font-weight: 800; margin-bottom: 20px; color: #333; }
    .info-group { margin-bottom: 15px; }
    .info-group p { font-size: 0.95rem; line-height: 1.6; color: #555; }
    .label { font-weight: 700; color: #333; }
    .footer { background-color: #000; color: #fff; padding: 20px; text-align: center; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="${CLIENT_URL}">
        <img src="https://i.ibb.co/5hdjR0z/kenny-1.png" alt="Kaizen Brand" />
      </a>
    </div>
    
    <div class="content">
      <h2>🛍️ New Order - Customer Details</h2>
      
      <div class="info-group">
        <p><span class="label">Order ID:</span> ${orderId}</p>
      </div>
      
      <div class="info-group">
        <p><span class="label">Customer Email:</span> ${email}</p>
      </div>
      
      <div class="info-group">
        <p><span class="label">Customer Phone:</span> ${phone}</p>
      </div>
      
      <div class="info-group">
        <p><span class="label">Delivery Option:</span> ${
          deliveryType || "Not specified"
        }</p>
      </div>
      
      <div class="info-group">
        <p><span class="label">Delivery Address:</span> ${
          address || "Not provided"
        }</p>
      </div>
      
      <div class="info-group">
        <p><span class="label">Marketer Code Used:</span> ${
          marketerCode || "None"
        }</p>
      </div>
    </div>
    
    <div class="footer">
      <p style="margin: 0;">Kaizen Brand - Making life easier</p>
      <p style="margin: 5px 0 0 0;">12, Abudu Street, Abule Oja, Lagos, Nigeria</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send customer info notification to admin
 * @param {Object} metadata - Customer metadata
 * @param {string} metadata.phone - Customer phone number
 * @param {string} metadata.email - Customer email
 * @param {string} metadata.orderId - Order ID
 * @param {string} metadata.deliveryType - Delivery method
 * @param {string} metadata.address - Delivery address
 * @param {string} metadata.marketerCode - Marketer code if used
 * @returns {Promise<Object>} Email sending result
 */
export const InfoToAdminEmail = async (metadata) => {
  try {
    // Validate metadata
    if (!metadata || typeof metadata !== "object") {
      throw new Error("Invalid metadata provided");
    }

    const { phone, email, orderId } = metadata;

    // Validate required fields
    if (!phone || !email || !orderId) {
      throw new Error("Missing required fields: phone, email, or orderId");
    }

    // Generate email template
    const htmlContent = generateInfoToAdminTemplate(metadata);

    // Email options
    const mailOptions = {
      from: `Kaizen Brand 🛍️ <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Customer Details - Order #${orderId}`,
      html: htmlContent,
      replyTo: email,
    };

    // Send email
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);

    console.log("Customer info email sent successfully:", {
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
    console.error("Error sending customer info email:", {
      error: error.message,
      orderId: metadata?.orderId,
      timestamp: new Date().toISOString(),
    });

    throw new Error(`Failed to send customer info email: ${error.message}`);
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
