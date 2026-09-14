import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const getStoredAuth = () => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) return { user: null, token: null };

    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { user: null, token: null };
    }

    // Schedule auto-logout
    const ttl = decoded.exp * 1000 - Date.now();
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }, ttl);

    return { user: JSON.parse(user), token };
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { user: null, token: null };
  }
};

const initial = getStoredAuth();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initial.user,
    token: initial.token,
    loading: false,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem("user", JSON.stringify(payload.user));
      localStorage.setItem("token", payload.token);

      // Schedule auto-logout
      try {
        const decoded = jwtDecode(payload.token);
        const ttl = decoded.exp * 1000 - Date.now();
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
        }, ttl);
      } catch { /* ignore */ }
    },
    updateUser: (state, { payload }) => {
      state.user = { ...state.user, ...payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setAuthLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

export const { setCredentials, updateUser, logout, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
