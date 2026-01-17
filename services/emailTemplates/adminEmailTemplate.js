/**
 * Generate admin email HTML template for new orders
 * @param {Object} metadata - Order metadata
 * @param {string} metadata.orderId - Order ID
 * @param {Array} metadata.cartItems - Items in cart
 * @param {number} metadata.subTotal - Subtotal amount
 * @param {number} metadata.totalPrice - Total price
 * @param {number} metadata.shippingFee - Shipping fee
 * @param {string} metadata.pickupLocation - Pickup location
 * @param {string} metadata.address - Delivery address
 * @param {string} metadata.email - Customer email
 * @param {string} todayDate - Current date
 * @returns {string} HTML email template
 */
export const generateAdminEmailTemplate = (metadata, todayDate) => {
  const {
    orderId,
    cartItems,
    subTotal,
    totalPrice,
    shippingFee,
    pickupLocation,
    address,
    email,
  } = metadata;

  // Generate cart items HTML
  const itemsHTML =
    cartItems.length > 0
      ? cartItems
          .map((item) => generateItemRow(item))
          .reduce((acc, val) => acc + val, "")
      : "";

  return `<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <title>New Order Notification</title>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <link href="https://fonts.googleapis.com/css?family=Lato:300,400,600,700" rel="stylesheet" type="text/css" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: 'Lato', Arial, sans-serif; color: #333; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
    #MessageViewBody a { color: inherit; text-decoration: none; }
    p { line-height: 1.6; margin: 0; }
    h2, h3 { margin: 0; font-weight: 600; }
    .desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; }
    @media (max-width: 670px) {
      .desktop_hide table.icons-inner, .social_block.desktop_hide .social-table { display: inline-block !important; }
      .icons-inner { text-align: center; }
      .icons-inner td { margin: 0 auto; }
      .fullMobileWidth, .row-content { width: 100% !important; }
      .mobile_hide { display: none; }
      .stack .column { width: 100%; display: block; }
      .desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; }
    }
  </style>
</head>
<body style="background-color: #f5f5f5; margin: 0; padding: 0;">
  <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
    <tbody>
      <tr>
        <td>
          <!-- Alert Header -->
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" style="width: 650px; background: linear-gradient(135deg, #C44536 0%, #D94C3A 100%); box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <tbody>
              <tr>
                <td style="padding: 40px 20px; text-align: center;">
                  <h2 style="color: #fff; margin: 0; font-size: 28px; letter-spacing: 0.5px;">New Order Alert</h2>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">A new customer order has been received</p>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Content -->
          <table align="center" border="0" cellpadding="0" cellspacing="0" style="width: 650px; background-color: #fff;">
            <tbody>
              <tr>
                <td style="padding: 30px;">
                  <!-- Customer & Order Info -->
                  <table style="width: 100%; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                        <p style="color: #666; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">Order ID</p>
                        <p style="font-size: 16px; font-weight: 600; color: #333; margin: 4px 0 0 0;">${orderId}</p>
                      </td>
                      <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #eee;">
                        <p style="color: #666; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">Order Date</p>
                        <p style="font-size: 16px; font-weight: 600; color: #333; margin: 4px 0 0 0;">${todayDate}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Customer Email Alert -->
                  <table style="width: 100%; background-color: #FFF3CD; border-left: 3px solid #FFC107; margin-bottom: 25px;">
                    <tr>
                      <td style="padding: 15px 15px;">
                        <p style="color: #856404; font-size: 13px; margin: 0;">
                          <strong>Customer Email:</strong> ${email}
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Items Section -->
                  <h3 style="color: #333; font-size: 16px; margin: 25px 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px; border-left: 3px solid #C44536; padding-left: 12px;">Order Items</h3>
                  ${itemsHTML}
                  
                  <!-- Summary Section -->
                  <table style="width: 100%; margin-top: 30px; background-color: #f9f9f9; border-radius: 4px;">
                    <tr>
                      <td style="padding: 15px 20px; border-bottom: 1px solid #eee;">
                        <p style="color: #666; font-size: 13px; margin: 0;">Subtotal</p>
                        <p style="font-size: 16px; font-weight: 600; color: #C44536; margin: 4px 0 0 0;">₦${formatPrice(
                          subTotal
                        )}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 20px; border-bottom: 1px solid #eee;">
                        <p style="color: #666; font-size: 13px; margin: 0;">Shipping Fee</p>
                        <p style="font-size: 16px; font-weight: 600; color: #C44536; margin: 4px 0 0 0;">₦${formatPrice(
                          shippingFee
                        )}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 18px 20px; background-color: #fff;">
                        <p style="color: #666; font-size: 13px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Total Amount</p>
                        <p style="font-size: 24px; font-weight: 700; color: #C44536; margin: 6px 0 0 0;">₦${formatPrice(
                          totalPrice
                        )}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Delivery Information -->
                  <h3 style="color: #333; font-size: 16px; margin: 30px 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px; border-left: 3px solid #C44536; padding-left: 12px;">Delivery Details</h3>
                  <table style="width: 100%; background-color: #f9f9f9; border-radius: 4px;">
                    <tr>
                      <td style="padding: 15px 20px;">
                        <p style="color: #666; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">Pickup Location</p>
                        <p style="font-size: 14px; color: #333; margin: 4px 0 0 0;">${
                          pickupLocation || "N/A"
                        }</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 20px;">
                        <p style="color: #666; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">Delivery Address</p>
                        <p style="font-size: 14px; color: #333; margin: 4px 0 0 0;">${
                          address || "N/A"
                        }</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Footer -->
          <table align="center" border="0" cellpadding="0" cellspacing="0" style="width: 650px; background-color: #2a2a2a; color: #fff;">
            <tbody>
              <tr>
                <td style="padding: 30px; text-align: center;">
                  <h3 style="color: #fff; margin: 0 0 15px 0; font-size: 18px; letter-spacing: 0.5px;">Kaizen Brand</h3>
                  <p style="margin: 0 0 12px 0; font-size: 12px; color: #b0b0b0;">12, Abudu Street, Abule Oja, Lagos, Nigeria</p>
                  <p style="margin: 0 0 15px 0; font-size: 12px; color: #b0b0b0;">Phone: <strong>234-905-421-0115</strong></p>
                  <p style="margin: 0; padding-top: 15px; border-top: 1px solid #444; font-size: 11px; color: #888;">© 2025 Kaizen Brand. All rights reserved.</p>
                  <p style="margin: 8px 0 0 0; font-size: 10px; color: #666;">Made with ❤️ by <a href="https://adebisiakinade.vercel.app/" style="color: #C44536; text-decoration: none; font-weight: 600;">Akinade</a></p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>`;
};

/**
 * Generate individual item row HTML
 * @param {Object} item - Cart item
 * @returns {string} Item row HTML
 */
const generateItemRow = (item) => {
  const {
    productImages,
    productName,
    size,
    length,
    type,
    quantity,
    productPrice,
    colorName,
  } = item;

  // Get first image from array or string
  let imageUrl = "";
  if (Array.isArray(productImages) && productImages.length > 0) {
    imageUrl = productImages[0];
  } else if (typeof productImages === "string") {
    imageUrl = productImages;
  }

  return `
    <table style="width: 100%; margin-bottom: 20px; border: 1px solid #ddd;">
      <tr>
        <td style="padding: 10px; width: 100px; background-color: #f9f9f9;">
          ${
            imageUrl
              ? `<img src="${encodeURI(
                  imageUrl
                )}" alt="${productName}" style="width: 100px; height: auto; display: block;" />`
              : "<p style='text-align: center; color: #ccc;'>No image</p>"
          }
        </td>
        <td style="padding: 10px; vertical-align: top;">
          <p style="margin: 0 0 5px 0;"><strong>${productName}</strong></p>
          ${
            size
              ? `<p style="margin: 0 0 5px 0; font-size: 13px;">Size: ${size}</p>`
              : ""
          }
          ${
            length
              ? `<p style="margin: 0 0 5px 0; font-size: 13px;">Length: ${length}</p>`
              : ""
          }
          ${
            type
              ? `<p style="margin: 0 0 5px 0; font-size: 13px;">Neck Type: ${type}</p>`
              : ""
          }
          ${
            colorName
              ? `<p style="margin: 0 0 5px 0; font-size: 13px;">Color: ${colorName}</p>`
              : ""
          }
          <p style="margin: 0; font-size: 13px; color: #666;">Quantity: ${
            quantity || 1
          }</p>
        </td>
        <td style="padding: 10px; text-align: right; vertical-align: top;">
          <p style="margin: 0; font-size: 14px; font-weight: bold;">₦${formatPrice(
            productPrice
          )}</p>
        </td>
      </tr>
    </table>
  `;
};

/**
 * Format price to readable currency format
 * @param {number} price - Price to format (e.g., 10000)
 * @returns {string} Formatted price
 */
const formatPrice = (price) => {
  // Handle null, undefined, or empty values
  if (price === null || price === undefined || price === "") return "0.00";

  // Convert to number if it's a string
  const numPrice =
    typeof price === "string" ? parseFloat(price) : Number(price);

  // Check if conversion resulted in NaN
  if (isNaN(numPrice)) return "0.00";

  // Return formatted price
  return numPrice.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
