import express from "express";
import {
  handleAdminMail,
  handleCustomerDetailsToAdmin,
  handleCustomerMail,
} from "../controllers/mail.controller.js";

const mailRouter = express.Router();

// Send Order mail to Admin
mailRouter.route("/admin-mail").post(handleAdminMail);

// Send Customer Details to admin
mailRouter
  .route("/customer-details-to-admin")
  .post(handleCustomerDetailsToAdmin);

//   Send Order Mail to customer
mailRouter.route("/customer-mail").post(handleCustomerMail);

export default mailRouter;
