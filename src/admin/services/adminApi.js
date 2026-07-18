export  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Base fetch helper (admin) ────────────────────────────────
const request = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem("adminToken");
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const res  = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();
  return data;
};

// ─── Admin Auth APIs ──────────────────────────────────────────

// Admin Login
export const adminLoginAPI = (email, password) =>
  request("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// Get admin profile (protected)
export const getAdminMeAPI = () =>
  request("/admin/me", { method: "GET" });

// Get user (data)
export const getUsersAPI = () =>
  request("/admin/users", {
    method: "GET",
  });

  // Update user
export const updateUserAPI = (id, data) =>
  request(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// Delete user
export const deleteUserAPI = (id) =>
  request(`/admin/users/${id}`, {
    method: "DELETE",
  });

 // ─── Template APIs (Admin) ────────────────────────────────────

export const adminGetTemplatesAPI = () =>
  request("/templates", { method: "GET" });

export const adminCreateTemplateAPI = (formData) =>
  request("/templates", { method: "POST", body: formData });

export const adminUpdateTemplateAPI = (id, formData) =>
  request(`/templates/${id}`, { method: "PUT", body: formData });

export const adminDeleteTemplateAPI = (id) =>
  request(`/templates/${id}`, { method: "DELETE" }); 

// ─── Content APIs (Admin) ─────────────────────────────────────
export const adminGetContentsAPI = () =>
  request("/contents", { method: "GET" });

export const adminCreateContentAPI = (data) =>
  request("/contents", { method: "POST", body: JSON.stringify(data) });

export const adminUpdateContentAPI = (id, data) =>
  request(`/contents/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const adminDeleteContentAPI = (id) =>
  request(`/contents/${id}`, { method: "DELETE" });

// ─── Chat APIs (Admin) ────────────────────────────────────────
export const adminGetChatsAPI = () =>
  request("/admin/chats", { method: "GET" });

export const adminDeleteChatAPI = (id) =>
  request(`/admin/chats/${id}`, { method: "DELETE" });

export const adminDeleteTemplateChatAPI = (templateId) =>
  request(`/admin/chats/template/${templateId}`, { method: "DELETE" });

// ─── Review APIs (Admin) ──────────────────────────────────────
export const adminGetReviewsAPI = () =>
  request("/admin/reviews", { method: "GET" });

export const adminDeleteReviewAPI = (id) =>
  request(`/admin/reviews/${id}`, { method: "DELETE" });

export const adminDeleteTemplateReviewsAPI = (templateId) =>
  request(`/admin/reviews/template/${templateId}`, { method: "DELETE" }); 

// ─── Contact APIs (Admin) ──────────────────────────────────────
export const adminGetContactsAPI = () =>
  request("/admin/contacts", { method: "GET" });
 
export const adminUpdateContactStatusAPI = (id, status) =>
  request(`/admin/contacts/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
 
export const adminDeleteContactAPI = (id) =>
  request(`/admin/contacts/${id}`, { method: "DELETE" });