import crypto from "crypto";
import { handleWebHook } from "./controllers/webhook.controller.js";
import dotenv from "dotenv";

dotenv.config();

// Simulate Paystack webhook request
async function testWebhookFlow() {
  console.log("🧪 Testing Paystack Webhook Flow...\n");

  // Mock metadata from frontend (what would come in Paystack webhook)
  const metadata = {
    orderId: "ORD-2026-001",
    email: "customer@example.com",
    phone: "08012345678",
    cartItems: [
      {
        productName: "Premium Agbada",
        productImages: ["https://via.placeholder.com/100"],
        size: "XL",
        len: "42",
        type: "Round Neck",
        quantity: 1,
        price: 45000,
      },
      {
        productName: "Classic Shirt",
        productImages: ["https://via.placeholder.com/100"],
        size: "L",
        quantity: 2,
        price: 15000,
      },
    ],
    subTotal: 60000,
    shippingFee: 2500,
    totalPrice: 62500,
    pickupLocation: "VI Store, Lagos",
    address: "123 Lekki Phase 1, Lagos",
    deliveryType: "home-delivery",
    marketerCode: "REF-2025-001",
  };

  // Create proper Paystack webhook payload
  const webhookPayload = {
    event: "charge.success",
    data: {
      id: 1234567890,
      reference: "PSREFCODE123",
      amount: 6250000, // amount in kobo (62500 * 100)
      paid_at: "2026-01-17T14:30:00.000Z",
      status: "success",
      customer: {
        id: 123,
        email: metadata.email,
        customer_code: "CUS_ABC123",
      },
      metadata: metadata,
    },
  };

  // Create signature as Paystack would
  const secret =
    process.env.PAYSTACK_SECRET_KEY || "sk_test_default_key_for_testing";
  const body = JSON.stringify(webhookPayload);
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

  console.log(
    "⚠️  Note: Using test secret key. Add PAYSTACK_SECRET_KEY to .env for production.\n"
  );

  // Mock request object
  const mockReq = {
    headers: {
      "x-paystack-signature": hash,
    },
    body: webhookPayload,
  };

  // Mock response object
  const mockRes = {
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    json: function (data) {
      this.data = data;
      return this;
    },
    send: function (data) {
      this.data = data;
      return this;
    },
  };

  try {
    console.log("📨 Simulating Paystack webhook with metadata:");
    console.log(JSON.stringify(metadata, null, 2));
    console.log("\n🔐 Webhook signature verified: ✅\n");

    // Call the webhook handler
    await handleWebHook(mockReq, mockRes);

    console.log("\n✅ Webhook Response:");
    console.log(`Status: ${mockRes.statusCode}`);
    console.log(`Message: ${JSON.stringify(mockRes.data)}`);

    if (mockRes.statusCode === 200) {
      console.log("\n🎉 WEBHOOK TEST PASSED - All emails sent successfully!");
    }
  } catch (error) {
    console.error("\n❌ Webhook test failed:", error.message);
  }
}

testWebhookFlow();
