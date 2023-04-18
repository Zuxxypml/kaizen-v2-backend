import express from "express";
import { login } from "../controllers/user.controllers.js";

const authRouter = express.Router();

// authRouter.route("/register").post(register);
authRouter.route("/login").post(login);

export default authRouter;
