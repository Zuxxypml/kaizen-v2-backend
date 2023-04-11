import mongoose from "mongoose";

const CollectionSchema = mongoose.Schema({
  collectionName: {
    type: String,
    min: 5,
    required: true,
  },
  collectionProductsIds: {
    type: Array,
    default: [],
  },
});
const Collection = mongoose.model("Collection", CollectionSchema);
export default Collection;
