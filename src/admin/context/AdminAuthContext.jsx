import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

// ─── Context create ───────────────────────────────────────────
const AdminAuthContext = createContext(null);

// ─── Hook — admin pages me use karo ──────────────────────────
export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside <AdminAuthProvider>");
  return ctx;
};

// ─── Provider ────────────────────────────────────────────────
export function AdminAuthProvider({ children }) {
  const [admin, setAdmin]     = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // App open hone pe sessionStorage se restore karo
useEffect(() => {
  const savedToken = sessionStorage.getItem("adminToken");
  const savedAdmin = sessionStorage.getItem("admin");

  if (savedToken && savedAdmin) {
    try {
      const decoded = jwtDecode(savedToken);

      if (decoded.exp * 1000 < Date.now()) {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("admin");
      } else {
        setToken(savedToken);
        setAdmin(JSON.parse(savedAdmin));

        const remainingTime = decoded.exp * 1000 - Date.now();

        setTimeout(() => {
          sessionStorage.removeItem("adminToken");
          sessionStorage.removeItem("admin");
          setAdmin(null);
          setToken(null);
          window.location.href = "/batman/login";
        }, remainingTime);
      }
    } catch {
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("admin");
    }
  }

  setLoading(false);
}, []);

  // ── Login ──
const login = useCallback((adminData, jwtToken) => {
  const decoded = jwtDecode(jwtToken);

  setAdmin(adminData);
  setToken(jwtToken);

  sessionStorage.setItem("adminToken", jwtToken);
  sessionStorage.setItem("admin", JSON.stringify(adminData));

  const remainingTime = decoded.exp * 1000 - Date.now();

  setTimeout(() => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("admin");
    setAdmin(null);
    setToken(null);
    window.location.href = "/admin/login";
  }, remainingTime);
}, []);

  // ── Logout ──
  const logout = useCallback(() => {
    setAdmin(null);
    setToken(null);
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("admin");
  }, []);

  const isLoggedIn = Boolean(admin && token);

  const value = {
    admin,
    token,
    loading,
    isLoggedIn,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}