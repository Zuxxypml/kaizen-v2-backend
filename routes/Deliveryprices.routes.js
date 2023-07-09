import express from "express";
import {
  handleCreateNewPrice,
  handleDeletePrice,
  handleEditPrice,
  handleGetAllPrices,
} from "../controllers/Deliveryprices.controllers.js";
import { verifyToken } from "../middleware/auth.js";

const deliveryPricesRouter = express.Router();

deliveryPricesRouter
  .route("/")
  .get(handleGetAllPrices)
  .post(verifyToken, handleCreateNewPrice);
deliveryPricesRouter
  .route("/patch/:priceID")
  .patch(verifyToken, handleEditPrice);

deliveryPricesRouter
  .route("/delete/:priceID")
  .delete(verifyToken, handleDeletePrice);
export default deliveryPricesRouter;
