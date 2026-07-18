import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

// ─── Context create ───────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Hook — har jagah se use karo ────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

// ─── Provider ────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true); // initial check ke liye

  // App open hone pe localStorage se restore karo
useEffect(() => {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (savedToken && savedUser) {
    try {
      const decoded = jwtDecode(savedToken);

      // Token expire check
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));

        // Auto logout when token expires
        const remainingTime = decoded.exp * 1000 - Date.now();

        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setToken(null);
          window.location.href = "/login";
        }, remainingTime);
      }
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  setLoading(false);
}, []);

  // ── Login ──
const login = useCallback((userData, jwtToken) => {
  const decoded = jwtDecode(jwtToken);

  setUser(userData);
  setToken(jwtToken);

  localStorage.setItem("token", jwtToken);
  localStorage.setItem("user", JSON.stringify(userData));

  const remainingTime = decoded.exp * 1000 - Date.now();

  setTimeout(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    window.location.href = "/login";
  }, remainingTime);
}, []);

  // ── Logout ──
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  // ── User update (profile change etc.) ──
  const updateUser = useCallback((updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem("user", JSON.stringify(merged));
  }, [user]);

  const isLoggedIn = Boolean(user && token);

  const value = {
    user,
    token,
    loading,
    isLoggedIn,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}