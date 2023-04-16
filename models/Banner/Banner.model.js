import mongoose from "mongoose";

const BannerSchema = mongoose.Schema(
  {
    bannerName: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    bannerDescription: {
      type: String,
      min: 2,
      max: 50,
    },
    bannerCollection: {
      type: String,
      min: 2,
      max: 50,
    },
    bannerImages: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", BannerSchema);
export default Banner;
