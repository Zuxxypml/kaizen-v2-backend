import { EmailSender } from "./services/sendEmail.js";
import { InfoToAdminEmail } from "./services/InfoToAdminEmail.js";
import { AdminEmailSender } from "./services/AdminEmailSender.js";

const testMetadata = {
  email: "basitadebisi.123@gmail.com", // Change this to YOUR email address
  orderId: "12345",
  cartItems: [
    {
      productName: "Test Product",
      productImages: ["https://via.placeholder.com/100"],
      size: "M",
      quantity: 1,
      price: 5000,
    },
  ],
  subTotal: 5000,
  totalPrice: 5500,
  shippingFee: 500,
  pickupLocation: "Lagos Store",
  address: "123 Main Street",
  phone: "08012345678",
  deliveryType: "home-delivery",
  marketerCode: "MARK001",
};

async function runTests() {
  console.log("Testing Email Services...\n");

  try {
    console.log("1. Testing EmailSender (customer email)...");
    const result1 = await EmailSender(testMetadata);
    console.log("✅ EmailSender successful:", result1);
  } catch (error) {
    console.error("❌ EmailSender failed:", error.message);
  }

  try {
    console.log("\n2. Testing InfoToAdminEmail...");
    const result2 = await InfoToAdminEmail(testMetadata);
    console.log("✅ InfoToAdminEmail successful:", result2);
  } catch (error) {
    console.error("❌ InfoToAdminEmail failed:", error.message);
  }

  try {
    console.log("\n3. Testing AdminEmailSender...");
    const result3 = await AdminEmailSender(testMetadata);
    console.log("✅ AdminEmailSender successful:", result3);
  } catch (error) {
    console.error("❌ AdminEmailSender failed:", error.message);
  }
}

runTests();
