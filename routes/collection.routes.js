import express from "express";
import {
  handleCreateNewCollection,
  handleGetCollections,
} from "../controllers/collection.controllers.js";
import { verifyToken } from "../middleware/auth.js";

const collectionRouter = express.Router();

collectionRouter
  .route("/")
  .get(handleGetCollections)
  .post(verifyToken, handleCreateNewCollection);

export default collectionRouter;
