import express from "express";
import {
  handleDeleteProduct,
  handleGetAllProducts,
} from "../controllers/product.controllers.js";

// Product Router Middleware
const productRouter = express.Router();

// Get All Products
productRouter.route("/").get(handleGetAllProducts);
productRouter.route("/delete/:productID").delete(handleDeleteProduct);
export default productRouter;
