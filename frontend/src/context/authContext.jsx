import { createContext, useState, useRef, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const refreshPromiseRef = useRef(null);

  async function checkAuth() {
    try {
      const newToken = await refreshAccessToken();
      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });
      const currentUser = response.data.data.user;
      setUser(currentUser);
    } catch (error) {
      setUser(null);
      setAccessToken(null);
      console.log("No active session found. Ready for a new login!");
    } finally {
      setIsCheckingAuth(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (userForm) => {
    setError("");
    try {
      const response = await api.post("/auth/login", userForm);
      const loggedInUser = response.data.data.user;
      const token = response.data.accessToken;
      setUser(loggedInUser);
      setAccessToken(token);
      return loggedInUser;
    } catch (error) {
      setUser(null);
      setAccessToken(null);
      const message = error.response?.data?.error || error.message;
      console.error(message);
      setError(message);
    }
  };

  const signup = async (userForm) => {
    setError("");
    try {
      const response = await api.post("/auth/signup", userForm);
      const signedInUser = response.data.data.user;
      const token = response.data.accessToken;
      setUser(signedInUser);
      setAccessToken(token);
      return signedInUser;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      console.error(message);
      setError(message);
      setUser(null);
      setAccessToken(null);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "Logout failed on server, but clearing local state anyway.",
        error,
      );
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const refreshAccessToken = async () => {
    setError("");
    if (!refreshPromiseRef.current)
      refreshPromiseRef.current = api.post("/auth/refresh");
    try {
      const response = await refreshPromiseRef.current;
      const newToken = response.data.accessToken;
      setAccessToken(newToken);
      return newToken;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      setError(message);
      setUser(null);
      setAccessToken(null);
      return Promise.reject(error);
    } finally {
      refreshPromiseRef.current = null;
    }
  };

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      config.headers = config.headers || {};
      if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
          return Promise.reject(error);
        }

        const isUnauthorized =
          error.response?.status === 401 &&
          error.response?.data?.code === "INVALID_ACCESS_TOKEN";

        const wasNotRetriedYet = !originalRequest._retry;
        const isNotRefreshRequest =
          !originalRequest.url.includes("/auth/refresh");

        if (isUnauthorized && wasNotRetriedYet && isNotRefreshRequest) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            setUser(null);
            setAccessToken(null);
            return Promise.reject(refreshError);
          }
        }

        if (
          error.response?.status === 401 &&
          [
            "INVALID_REFRESH_TOKEN",
            "SESSION_EXPIRED",
            "USER_NOT_FOUND",
          ].includes(error.response?.data?.code)
        ) {
          setUser(null);
          setAccessToken(null);
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const value = {
    user,
    login,
    signup,
    logout,
    refreshAccessToken,
    checkAuth,
    isCheckingAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
