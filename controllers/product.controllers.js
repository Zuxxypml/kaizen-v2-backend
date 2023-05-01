import cloudinary from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/Products/Product.model.js";

// Utility
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGE_DIR = path.join(__dirname, "public", "assets");
const IMAGE_EXT = "webp";

// Configure Cloudinary
cloudinary.config({
  cloud_name: `${process.env.CLOUD_NAME}`,
  api_key: `${process.env.API_KEY}`,
  api_secret: `${process.env.API_SECRET}`,
});

const saveImagesWithModifiedName = async (images, productName) => {
  const imageUrls = [];

  for (let i = 0; i < images.length; i++) {
    const originalName = images[i].originalname;
    const productNameWithIndex = `${productName}Image${i}`;
    const modifiedName = `${productNameWithIndex}${path.extname(originalName)}`;

    try {
      // Upload the image directly to Cloudinary and convert to WebP format
      const uploadResult = await cloudinary.uploader.upload(images[i].path, {
        public_id: modifiedName,
        resource_type: "auto",
        format: "webp", // Convert the image to WebP format
      });

      // Retrieve the secure URL from the upload result
      const imageUrl = uploadResult.secure_url;
      imageUrls.push(imageUrl);
    } catch (err) {
      console.log(err);
      throw new Error(`Error uploading image: ${err.message}`);
    }
  }
  return imageUrls;
};

export const handleGetAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    return res.status(200).json(allProducts);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const handleCreateNewProduct = async (req, res) => {
  const {
    productName,
    productCategory,
    productCollection,
    productPrice,
    productType,
    isBestSelling,
  } = req.body;
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      throw new Error("No files uploaded!");
    }
    const images = req.files;

    const existingProduct = await Product.findOne({
      productCategory,
      productCollection,
      productName,
    })
      .then((data) => {
        if (data) {
          return data;
        }
      })
      .catch((err) => {
        return err;
      });
    if (existingProduct) {
      return res.status(400).json({ error: "Product Already Exists" });
    } else if (!existingProduct) {
      const newProduct = new Product({
        productCategory,
        productCollection,
        productImages: await saveImagesWithModifiedName(
          images,
          productName.replace(/\s/g, "-")
        ),
        productName,
        productPrice,
        productType,
        isBestSelling: isBestSelling === "true" ? true : false,
      });
      const savedProduct = await newProduct.save();
      return res.status(200).json({ savedProduct });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
export const handleDeleteProduct = async (req, res) => {
  const productID = req.params.productID;

  try {
    const result = await Product.deleteOne({ _id: productID });
    console.log(`Deleted ${result.deletedCount} item(s)`);

    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
export const handleEditProductDetails = async (req, res) => {
  const id = req.params.productID;
  const {
    productName,
    productCategory,
    productCollection,
    productPrice,
    productImages,
    productType,
    isBestSelling,
  } = req.body;
  console.log(req.body);
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      throw new Error("No files uploaded!");
    }
    const images = req.files;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        productCategory,
        productCollection,
        productImages: await saveImagesWithModifiedName(
          images,
          productName.replace(/\s/g, "-")
        ),
        productPrice,
        productType,
        isBestSelling: isBestSelling === "true" ? true : false,
      },
      { new: true }
    );
    return res.status(200).json({ updatedProduct: updatedProduct });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Unabled to Edit product. An error occured.." });
  }
};
export const handleAddOrRemoveProductInBestSelling = async (req, res) => {
  const id = req.params.productID;
  const { isBestSelling } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        isBestSelling: isBestSelling === true ? true : false,
      },
      { new: true }
    );
    return res.status(200).json({ updatedProduct: updatedProduct });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res
      .status(400)
      .json({ error: "Unabled to Add or remove product. An error occured.." });
  }
};
