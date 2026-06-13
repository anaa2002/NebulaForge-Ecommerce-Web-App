import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { AuthErrors } from "../utils/authErrors.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw AuthErrors.unauthorized();

  const token = authHeader.split(" ")[1];

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
  } catch {
    throw AuthErrors.invalidAccessToken();
  }

  const user = await User.findById(decoded.userId);

  if (!user) throw AuthErrors.unauthorized();

  if (user.passwordCreatedAfter?.(decoded.iat)) throw AuthErrors.unauthorized();

  req.user = user;
  next();
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (user && !user.passwordCreatedAfter?.(decoded.iat)) {
      req.user = user;
    }
  } catch (error) {
    console.log("Invalid token, treating user as a guest.");
  }

  next();
});
