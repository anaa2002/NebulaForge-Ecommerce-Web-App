import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import { hashToken } from "../utils/token.js";
import { setAuthCookies, clearAuthCookies } from "../utils/authCookies.js";
import {
  createSession,
  getSession,
  deleteSession,
} from "../services/authSession.service.js";
import { AuthErrors } from "../utils/authErrors.js";

export const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) throw AuthErrors.missingFields();

  const user = await User.create({ username, email, password });

  const session = await createSession(user._id);

  setAuthCookies(res, session.refreshToken, session.sessionId);

  user.password = undefined;

  return res.status(201).json({
    status: "success",
    data: { user },
    accessToken: session.accessToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw AuthErrors.missingFields();

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password)))
    throw AuthErrors.wrongCredentials();

  const session = await createSession(user._id);

  setAuthCookies(res, session.refreshToken, session.sessionId);

  user.password = undefined;

  return res.status(200).json({
    status: "success",
    data: { user },
    accessToken: session.accessToken,
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  if (!refreshToken || !sessionId) throw AuthErrors.cookiesNotFound();

  const session = await getSession(sessionId);

  if (!session) throw AuthErrors.sessionExpired();

  const refreshTokenHash = hashToken(refreshToken);

  if (refreshTokenHash !== session.refreshTokenHash) {
    await deleteSession(sessionId, session.userId);
    clearAuthCookies(res);

    throw AuthErrors.invalidRefreshToken();
  }

  const userId = session.userId;

  if (!userId) throw AuthErrors.userNotFound();

  await deleteSession(sessionId, userId);

  const newSession = await createSession(userId);

  setAuthCookies(res, newSession.refreshToken, newSession.sessionId);

  return res.status(200).json({
    accessToken: newSession.accessToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    const session = await getSession(sessionId);

    if (session?.user) await deleteSession(sessionId, session.userId);
  }

  clearAuthCookies(res);

  return res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
});

export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});
