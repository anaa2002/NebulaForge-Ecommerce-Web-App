import { ERROR_CODES } from "../constants/errorCodes.js";
import ApiError from "./ApiError.js";

export const productError = {
  notFound: () => new ApiError("Not found.", 404, ERROR_CODES.NOT_FOUND),
};
