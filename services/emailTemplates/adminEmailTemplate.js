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
  <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
    #MessageViewBody a { color: inherit; text-decoration: none; }
    p { line-height: inherit; }
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
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" style="width: 650px; background-color: #b8a06a;">
            <tbody>
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h2 style="color: #fff; margin: 0;">New Order Received! 🛍️</h2>
                </td>
              </tr>
            </tbody>
          </table>

          <table align="center" border="0" cellpadding="0" cellspacing="0" style="width: 650px;">
            <tbody>
              <tr>
                <td style="padding: 20px; background-color: #fff;">
                  <p><strong>Order ID:</strong> ${orderId}</p>
                  <p><strong>Date:</strong> ${todayDate}</p>
                  <p><strong>Customer Email:</strong> ${email}</p>
                  <hr style="border: none; border-top: 1px solid #ddd;" />
                  
                  <h3 style="color: #333;">Order Items</h3>
                  ${itemsHTML}
                  
                  <hr style="border: none; border-top: 1px solid #ddd; margin-top: 20px;" />
                  
                  <table style="width: 100%; margin-top: 20px;">
                    <tr>
                      <td style="padding: 10px; text-align: left;"><strong>Subtotal:</strong></td>
                      <td style="padding: 10px; text-align: right;">₦${formatPrice(
                        subTotal
                      )}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; text-align: left;"><strong>Shipping Fee:</strong></td>
                      <td style="padding: 10px; text-align: right;">₦${formatPrice(
                        shippingFee
                      )}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                      <td style="padding: 10px; text-align: left;"><strong>Total:</strong></td>
                      <td style="padding: 10px; text-align: right;"><strong>₦${formatPrice(
                        totalPrice
                      )}</strong></td>
                    </tr>
                  </table>

                  <hr style="border: none; border-top: 1px solid #ddd; margin-top: 20px;" />
                  
                  <h3 style="color: #333;">Delivery Information</h3>
                  <p><strong>Pickup Location:</strong> ${
                    pickupLocation || "N/A"
                  }</p>
                  <p><strong>Delivery Address:</strong> ${address || "N/A"}</p>
                </td>
              </tr>
            </tbody>
          </table>

          <table align="center" border="0" cellpadding="0" cellspacing="0" style="width: 650px; background-color: #000; color: #fff;">
            <tbody>
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p style="margin: 0; font-size: 14px;">Kaizen Brand - Making life easier</p>
                  <p style="margin: 5px 0 0 0; font-size: 12px;">12, Abudu Street, Abule Oja, Lagos, Nigeria</p>
                  <p style="margin: 10px 0 0 0; font-size: 12px;">Help & FAQ: <strong>234-905-421-0115</strong></p>
                  <p style="margin: 10px 0 0 0; font-size: 11px;"><a href="https://adebisiakinade.vercel.app/" style="color: #9d9d9d; text-decoration: none;">Designed by Adebisi Akinade</a></p>
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
