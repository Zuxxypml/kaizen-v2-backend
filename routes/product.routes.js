import express from "express";
import {
  handleAddOrRemoveProductInBestSelling,
  handleDeleteProduct,
  handleGetAllProducts,
} from "../controllers/product.controllers.js";
import { verifyToken } from "../middleware/auth.js";

// Product Router Middleware
const productRouter = express.Router();

// Get All Products
productRouter.route("/").get(handleGetAllProducts);
productRouter
  .route("/delete/:productID")
  .delete(verifyToken, handleDeleteProduct);
productRouter
  .route("/patch/:productID")
  .patch(handleAddOrRemoveProductInBestSelling);
export default productRouter;
