import express from "express";
import { getProducts, getProductId } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductId);

export default productRouter;
