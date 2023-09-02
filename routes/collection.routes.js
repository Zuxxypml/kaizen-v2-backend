import express from "express";
import {
  handleCreateNewCollection,
  handleDeleteCollection,
  handleGetCollections,
} from "../controllers/collection.controllers.js";
import { verifyToken } from "../middleware/auth.js";

const collectionRouter = express.Router();

collectionRouter
  .route("/")
  .get(handleGetCollections)
  .post(verifyToken, handleCreateNewCollection);
collectionRouter
  .route("/delete/:collectionID")
  .delete(verifyToken, handleDeleteCollection);

export default collectionRouter;
