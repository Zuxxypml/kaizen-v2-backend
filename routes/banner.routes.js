import express from "express";
import {
  handleDeleteBanner,
  handleGetAllBanners,
} from "../controllers/banner.controllers.js";
import { verifyToken } from "../middleware/auth.js";

const bannerRouter = express.Router();

bannerRouter.route("/").get(handleGetAllBanners);
bannerRouter.route("/delete/:bannerID").delete(verifyToken, handleDeleteBanner);

export default bannerRouter;
