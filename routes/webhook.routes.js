import express from "express";
import { handleWebHook } from "../controllers/webhook.controller.js";

const webHookRouter = express.Router();

// webHookRouter.route("/register").post(register);
webHookRouter.route("/").post(handleWebHook);

export default webHookRouter;
