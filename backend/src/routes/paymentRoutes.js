import express from "express";
import { createPaymentIntent } from "../controllers/paymentController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-payment-intent", optionalAuth, createPaymentIntent);

export default paymentRouter;
