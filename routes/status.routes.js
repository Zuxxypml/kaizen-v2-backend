import express from "express";
import { checkOnline } from "../controllers/status.controller.js";
const checkRouter = express.Router();

// Use the check online controller for the GET endpoint
checkRouter.get("/", checkOnline);

export default checkRouter;
