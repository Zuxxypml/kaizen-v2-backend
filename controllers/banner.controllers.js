import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import Banner from "../models/Banner/Banner.model.js";

// Utility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGE_DIR = path.join(__dirname, "public", "assets");
const IMAGE_EXT = "webp";

const saveImageWithModifiedName = async (image, imagePath, modifiedName) => {
  const oldFilePath = imagePath;
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

export const handleCreateNewBanner = async (req, res) => {
  const { bannerName, bannerDescription, bannerCollection } = req.body;
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      throw new Error("No files uploaded!");
    }
    const images = req.files;

    const existingBanner = await Banner.findOne({
      bannerName,
      bannerDescription,
      bannerCollection,
    })
      .then((data) => {
        if (data) {
          return data;
        }
      })
      .catch((err) => {
        return err;
      });
    if (existingBanner) {
      return res.status(400).json({ error: "Banner Already Exists" });
    } else if (!existingBanner) {
      const newBanner = new Banner({
        bannerImages: await saveImagesWithModifiedName(
          images,
          bannerName.replace(/\s/g, "-")
        ),
        bannerName,
        bannerDescription,
        bannerCollection,
      });
      const savedBanner = await newBanner.save();
      return res.status(200).json({ savedBanner });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const handleGetAllBanners = async (req, res) => {
  try {
    const allBanners = await Banner.find({});

    return res.status(200).json(allBanners);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
export const handleDeleteBanner = async (req, res) => {
  const bannerID = req.params.bannerID;

  try {
    const result = await Banner.deleteOne({ _id: bannerID });
    console.log(`Deleted ${result.deletedCount} item(s)`);

    return res.status(200).json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleEditBannerDetails = async (req, res) => {
  const id = req.params.bannerID;
  const { bannerName, bannerDescription, bannerCollection } = req.body;
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      throw new Error("No files uploaded!");
    }
    const images = req.files;

    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      {
        bannerName,
        bannerDescription,
        bannerCollection,
        bannerImages: await saveImagesWithModifiedName(
          images,
          bannerName.replace(/\s/g, "-")
        ),
      },
      { new: true }
    );
    return res.status(200).json({ updatedBanner: updatedBanner });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: "Unabled to Edit banner. An error occured.." });
  }
};
