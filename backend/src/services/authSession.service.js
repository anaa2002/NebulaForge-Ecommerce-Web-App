import { redis } from "../config/redis.js";
import {
  signAccessToken,
  createRefreshToken,
  hashToken,
  createSessionId,
} from "../utils/token.js";
import { REFRESH_TOKEN_TTL_SECONDS } from "../utils/authCookies.js";

export async function saveSessionToRedis(sessionId, userId, refreshTokenHash) {
  await redis.set(
    `sessionId:${sessionId}`,
    {
      userId: userId.toString(),
      refreshTokenHash,
    },
    { ex: REFRESH_TOKEN_TTL_SECONDS() },
  );

  await redis.sadd(`userSessions:${userId}`, sessionId);
  await redis.expire(`userSessions:${userId}`, REFRESH_TOKEN_TTL_SECONDS());
}

export async function createSession(userId) {
  const accessToken = signAccessToken(userId);
  const refreshToken = createRefreshToken();
  const refreshTokenHash = hashToken(refreshToken);
  const sessionId = createSessionId();

  await saveSessionToRedis(sessionId, userId, refreshTokenHash);

  return {
    accessToken,
    refreshToken,
    sessionId,
  };
}

export async function getSession(sessionId) {
  const session = await redis.get(`sessionId:${sessionId}`);

  //   if (!rawSession) return null;

  //   return JSON.parse(rawSession);
  return session;
}

export async function deleteSession(sessionId, userId) {
  await redis.del(`sessionId:${sessionId}`);
  await redis.srem(`userSessions:${userId}`, sessionId);
}
