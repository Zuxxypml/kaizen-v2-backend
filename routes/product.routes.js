import express from "express";
import {
  handleDeleteProduct,
  handleEditProductDetails,
  handleGetAllProducts,
} from "../controllers/product.controllers.js";

// Product Router Middleware
const productRouter = express.Router();

// Get All Products
productRouter.route("/").get(handleGetAllProducts);
// productRouter.route("/edit/:productID").put(handleEditProductDetails);
productRouter.route("/delete/:productID").delete(handleDeleteProduct);
export default productRouter;
