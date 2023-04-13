import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  handleCreateNewProduct,
  handleEditProductDetails,
} from "./controllers/product.controllers.js";
import collectionRouter from "./routes/collection.routes.js";
import mailRouter from "./routes/mail.routes.js";
import productRouter from "./routes/product.routes.js";
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

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// ROUTES WITH FILES
app.post("/api/product", upload.array("pictures"), handleCreateNewProduct);
app.patch(
  "/api/product/edit/:productID",
  upload.array("pictures"),
  handleEditProductDetails
);
// ROUTES
app.use("/api/product", productRouter);
app.use("/api/collection", collectionRouter);
app.use("/api/mail", mailRouter);

// ****** SEND API
app.post("/send");

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
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
