import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/Product.js";
import { productError } from "../utils/productErrors.js";

export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skipAmount = (page - 1) * limit;

  const { category, search, minPrice, maxPrice } = req.query;

  let queryPocket = {};
  if (category) queryPocket.category = category;

  if (search) queryPocket.name = { $regex: search, $options: "i" };

  if (minPrice || maxPrice) {
    queryPocket.price = {};
    if (minPrice) queryPocket.price.$gte = Number(minPrice);
    if (maxPrice) queryPocket.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(queryPocket)
    .skip(skipAmount)
    .limit(limit);

  const totalItems = await Product.countDocuments(queryPocket);
  const totalPages = Math.ceil(totalItems / limit);

  res.status(200).json({
    status: "success",
    data: products,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totlItems: totalItems,
    },
  });
});

export const getProductId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw productError.notFound();
  res.status(200).json({ status: "success", data: product });
});

export const createProduct = asyncHandler(async (req, res) => {});
