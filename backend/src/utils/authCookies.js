export const REFRESH_TOKEN_TTL_SECONDS = () =>
  Number(process.env.JWT_REFRESH_TOKEN_EXPIRES) * 24 * 60 * 60;

export function getRefreshTokenCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: REFRESH_TOKEN_TTL_SECONDS() * 1000,
  };
}

export function setAuthCookies(res, refreshToken, sessionId) {
  res.cookie("refreshToken", refreshToken, {
    ...getRefreshTokenCookieOptions(),
    path: "/api/auth",
    // path: "/api/auth/refresh",
  });

  res.cookie("sessionId", sessionId, {
    ...getRefreshTokenCookieOptions(),
    path: "/api/auth",
  });
}

export function clearAuthCookies(res) {
  res.clearCookie("refreshToken", {
    ...getRefreshTokenCookieOptions(),
    path: "/api/auth",
  });

  res.clearCookie("sessionId", {
    ...getRefreshTokenCookieOptions(),
    path: "/api/auth",
  });
}
