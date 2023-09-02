import Collection from "../models/Collection/Collection.model.js";

export const handleGetCollections = async (req, res) => {
  try {
    const collections = await Collection.find({});
    return res.status(200).json({ collections: collections });
  } catch (error) {
    return res.status(400).json({ error: "Unable to get collections" });
  }
};

// Create New Collection
export const handleCreateNewCollection = async (req, res) => {
  try {
    const { collectionName } = req.body;
    const existingCollection = await Collection.findOne({
      collectionName,
    })
      .then((data) => {
        if (data) {
          return data;
        }
      })
      .catch((err) => {
        return err;
      });
    if (existingCollection) {
      return res.status(400).json({ error: "Collection Already Exists" });
    } else if (!existingCollection) {
      const newCollection = new Collection({
        collectionName: collectionName,
      });
      // Saves new Collection
      const savedcollection = await newCollection.save();

      // Confirms Collection and returns all collections
      if (savedcollection) {
        const allCollections = await Collection.find({});
        res.status(200).json({ collections: allCollections });
      } else return;
    }
  } catch (error) {
    return res.status(400).json({ error: "Unable to get collections" });
  }
};
export const handleDeleteCollection = async (req, res) => {
  try {
    const collectionID = req.params.collectionID;

    // Check if the collection exists
    const existingCollection = await Collection.findOne({ _id: collectionID });

    if (!existingCollection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Use the deleteOne method to remove the collection
    const deletionResult = await Collection.deleteOne({
      _id: existingCollection._id,
    });

    if (deletionResult.deletedCount === 1) {
      // Optionally, you can fetch all collections and return them after deletion
      const allCollections = await Collection.find({});
      return res.status(200).json({ collections: allCollections });
    } else {
      return res.status(500).json({ error: "Failed to delete the collection" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
