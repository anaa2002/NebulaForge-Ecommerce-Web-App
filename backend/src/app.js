import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import { handleStripeWebhook } from "./controllers/paymentController.js";
import ApiError from "./utils/ApiError.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoute.js";
import paymentRouter from "./routes/paymentRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(cookieParser());

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/payment", paymentRouter);

app.use(/.*/, (req, res) => {
  throw new ApiError("URL not found", 404, "URL_NOT_FOUND");
});

app.use(errorMiddleware);
export default app;
