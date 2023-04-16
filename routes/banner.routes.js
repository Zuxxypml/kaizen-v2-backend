import express from "express";
import {
  handleDeleteBanner,
  handleGetAllBanners,
} from "../controllers/banner.controllers.js";

const bannerRouter = express.Router();

bannerRouter.route("/").get(handleGetAllBanners);
bannerRouter.route("/delete/:bannerID").delete(handleDeleteBanner);

export default bannerRouter;
