import jwt from "jsonwebtoken";
import crypto from "crypto";

export function signAccessToken(userId) {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES },
  );
  return accessToken;
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createRefreshToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function createSessionId(){
    return crypto.randomUUID();
}