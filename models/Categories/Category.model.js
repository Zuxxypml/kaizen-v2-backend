import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    min: 5,
  },
  categoryProducts: {
    type: Array,
    default: [],
  },
});
const Category = mongoose.model("Category", CategorySchema);
export default Category;
