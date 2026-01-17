import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function testEmailConnection() {
  console.log("🔍 Diagnostic Email Connection Test\n");
  console.log("Email Configuration:");
  console.log("- Username:", process.env.MAIL_USERNAME);
  console.log("- Service: Gmail");
  console.log("- Using App Password: Yes\n");

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.APP_PASSWORD,
      },
    });

    // Verify connection
    console.log("📡 Testing connection to Gmail...");
    await transporter.verify();
    console.log("✅ Connection successful!\n");

    // Send a test email
    console.log("📧 Sending test email...");
    const testEmail = process.env.MAIL_USERNAME; // Send to yourself

    const mailOptions = {
      from: `Kaizen Brand 🛍️ <${process.env.MAIL_USERNAME}>`,
      to: testEmail,
      subject: "✅ Kaizen Email Service Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b8a06a;">Email Service is Working! ✅</h2>
          <p>This is a test email from your Kaizen Backend.</p>
          <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Recipient:</strong> ${testEmail}</p>
          <hr />
          <p style="color: #666; font-size: 12px;">
            If you received this email, your email service is configured correctly.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("\n📬 Check your inbox (or spam folder) at:", testEmail);
  } catch (error) {
    console.error("❌ Error:", error.message);

    if (error.message.includes("Invalid login")) {
      console.log("\n⚠️  Troubleshooting:");
      console.log("1. Verify Gmail APP_PASSWORD is correct");
      console.log(
        "2. Make sure you're using an App Password, not your Gmail password"
      );
      console.log(
        "3. App Passwords require 2FA to be enabled on your Google account"
      );
      console.log(
        "4. Generate a new App Password at: https://myaccount.google.com/apppasswords"
      );
    } else if (error.message.includes("Timeout")) {
      console.log("\n⚠️  Connection Timeout - Check your internet connection");
    }
  }
}

testEmailConnection();
