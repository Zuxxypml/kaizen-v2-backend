import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productCategory: {
      type: String,
      min: 2,
      max: 50,
    },
    productCollection: {
      type: String,
      min: 2,
      max: 50,
    },
    productType: {
      type: String,
    },
    productImages: {
      type: Array,
      default: [],
    },
    isBestSelling: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
