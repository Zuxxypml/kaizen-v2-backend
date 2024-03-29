import path from "path";
import { fileURLToPath } from "url";
import Banner from "../models/Banner/Banner.model.js";

// Utility
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const IMAGE_DIR = path.join(__dirname, "public", "assets");
// const IMAGE_EXT = "webp";

const saveImagesWithModifiedName = async (files, productName) => {
  const imageUrls = [];
  console.log(files);
  try {
    files.map((file) => imageUrls.push(file.path));
  } catch (err) {
    console.error(err);
    throw new Error(`Error uploading images: ${err.message}`);
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
