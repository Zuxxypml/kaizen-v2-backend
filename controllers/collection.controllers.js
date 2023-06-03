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
