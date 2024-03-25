import bodyParser from "body-parser";
import cloudinary from "cloudinary";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import { fileURLToPath } from "url";
import {
  handleCreateNewBanner,
  handleEditBannerDetails,
} from "./controllers/banner.controllers.js";
import {
  handleCreateNewProduct,
  handleEditProductDetails,
} from "./controllers/product.controllers.js";
import { verifyToken } from "./middleware/auth.js";
import deliveryPricesRouter from "./routes/Deliveryprices.routes.js";
import bannerRouter from "./routes/banner.routes.js";
import collectionRouter from "./routes/collection.routes.js";
import mailRouter from "./routes/mail.routes.js";
import productRouter from "./routes/product.routes.js";
import authRouter from "./routes/user.routes.js";
import checkRouter from "./routes/status.routes.js";
dotenv.config();

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// var whitelist = [
//   "http://localhost:3000",
//   "http://localhost:3000/",
//   "http://www.localhost:3000",
//   "http://www.localhost:3000/",
//   "http://172.20.10.9:3000",
//   "http://www.172.20.10.9:3000",
// ];
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };
// app.use(cors(corsOptions));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Configure Cloudinary
cloudinary.config({
  cloud_name: `${process.env.CLOUD_NAME}`,
  api_key: `${process.env.API_KEY}`,
  api_secret: `${process.env.API_SECRET}`,
});
// Configure Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "Assets",
    format: async (req, file) => "webp", // Set the format of the uploaded image
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Set the public ID for the uploaded image
  },
});

// Initialize Multer upload middleware
const upload = multer({ storage });

// ROUTES WITH FILES
app.post(
  "/api/product",
  verifyToken,
  upload.array("pictures"),
  handleCreateNewProduct
);
app.patch(
  "/api/product/edit/:productID",
  verifyToken,
  upload.array("pictures"),
  handleEditProductDetails
);
app.post(
  "/api/banner",
  verifyToken,
  upload.array("pictures"),
  handleCreateNewBanner
);
app.patch(
  "/api/banner/edit/:bannerID",
  verifyToken,
  upload.array("pictures"),
  handleEditBannerDetails
);
// ROUTES
app.use("/api/product", productRouter);
app.use("/api/collection", collectionRouter);
app.use("/api/mail", mailRouter);
app.use("/api/banner", bannerRouter);
app.use("/auth", authRouter);
app.use("/api/delivery-prices", deliveryPricesRouter);
app.use("/api/check", checkRouter);

/* MONGOOSE SETUP */
const PORT = 6001 || process.env.PORT;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    console.log("Database Connected and Server Successfully Started");
  })
  .catch((error) => console.log(`${error} did not connect`));
