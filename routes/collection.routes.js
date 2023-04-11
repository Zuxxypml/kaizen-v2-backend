import express from "express";
import { handleGetCollections } from "../controllers/collection.controllers.js";

const collectionRouter = express.Router();

collectionRouter.route("/").get(handleGetCollections);

export default collectionRouter;
