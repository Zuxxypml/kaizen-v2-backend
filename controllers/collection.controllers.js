import Collection from "../models/Collection/Collection.model.js";

export const handleGetCollections = async (req, res) => {
  try {
    const collections = await Collection.find({});
    return res.status(200).json({ collections: collections });
  } catch (error) {
    return res.status(400).json({ error: "Unable to get collections" });
  }
};

// Add to Collection or create and add to collection
export const addProductToExistingCollectionOrNewCollection = async (
  req,
  res
) => {};
