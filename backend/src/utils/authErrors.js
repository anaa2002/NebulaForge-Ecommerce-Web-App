import ApiError from "./ApiError.js";
import { ERROR_CODES } from "../constants/errorCodes.js";

export const AuthErrors = {
  missingFields: () =>
    new ApiError("All fields are required.", 400, ERROR_CODES.MISSING_FIELDS),

  wrongCredentials: () =>
    new ApiError("Wrong credentials.", 401, ERROR_CODES.WRONG_CREDENTIALS),

  cookiesNotFound: () =>
    new ApiError("Cookies not found.", 401, ERROR_CODES.COOKIES_NOT_FOUND),

  sessionExpired: () =>
    new ApiError("Session expired.", 401, ERROR_CODES.SESSION_EXPIRED),

  invalidRefreshToken: () =>
    new ApiError(
      "Invalid refresh token.",
      401,
      ERROR_CODES.INVALID_REFRESH_TOKEN,
    ),

  userNotFound: () =>
    new ApiError(
      "User with that session does not exist.",
      404,
      ERROR_CODES.USER_NOT_FOUND,
    ),

  invalidAccessToken: () =>
    new ApiError(
      "Invalid or expired access token.",
      401,
      ERROR_CODES.INVALID_ACCESS_TOKEN,
    ),

  unauthorized: () =>
    new ApiError("Unauthorized.", 401, ERROR_CODES.UNAUTHORIZED),
};
