import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import Product from "../models/Products/Product.model.js";

// Utility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGE_DIR = path.join(__dirname, "public", "assets");
const IMAGE_EXT = "webp";

const saveImageWithModifiedName = async (image, imagePath, modifiedName) => {
  const newFilePath = path.join(path.dirname(imagePath), modifiedName);
  try {
    // Resize and convert the image to WebP format
    await sharp(image.buffer).webp({ quality: 80 }).toFile(newFilePath);
  } catch (err) {
    throw new Error(`Error processing image: ${err.message}`);
  }
};

const saveImagesWithModifiedName = async (images, productName) => {
  const imageNames = [];

  for (let i = 0; i < images.length; i++) {
    const originalName = images[i].originalname;
    const productNameWithIndex = `${productName}Image${i}`;
    const modifiedName = `${productNameWithIndex}.${IMAGE_EXT}`;
    const imagePath = path.join(IMAGE_DIR, modifiedName);

    try {
      const fileData = fs.readFileSync(images[i].path); // Read file data from disk
      await saveImageWithModifiedName(fileData, images[i].path, modifiedName); // Pass file data to the image processing function
      imageNames.push(modifiedName);
    } catch (err) {
      throw new Error(`Error processing image: ${err.message}`);
    }
  }

  return imageNames;
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
