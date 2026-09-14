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

// Admin Login (step 1: email + password)
export const adminLoginAPI = (email, password) =>
  request("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// Admin Verify OTP (step 2)
export const adminVerifyOTPAPI = (email, otp) =>
  request("/admin/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });

// Admin Resend OTP
export const adminResendOTPAPI = (email) =>
  request("/admin/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
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

export const adminReplyChatAPI = (id, message) =>
  request(`/admin/chats/${id}/reply`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });

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

export const adminReplyContactAPI = (id, reply) =>
  request(`/admin/contacts/${id}/reply`, {
    method: "POST",
    body: JSON.stringify({ reply }),
  });

// ─── Blog APIs (Admin) ────────────────────────────────────────
export const adminGetBlogsAPI = () =>
  request("/admin/blogs", { method: "GET" });

export const adminCreateBlogAPI = (formData) =>
  request("/admin/blogs", { method: "POST", body: formData });

export const adminUpdateBlogAPI = (id, formData) =>
  request(`/admin/blogs/${id}`, { method: "PUT", body: formData });

export const adminDeleteBlogAPI = (id) =>
  request(`/admin/blogs/${id}`, { method: "DELETE" });

// ─── Newsletter APIs (Admin) ──────────────────────────────────
export const adminGetNewsletterAPI = () =>
  request("/admin/newsletter", { method: "GET" });

export const adminDeleteNewsletterAPI = (id) =>
  request(`/admin/newsletter/${id}`, { method: "DELETE" });

export const adminSendNewsletterAPI = (subject, message) =>
  request("/admin/newsletter/send", {
    method: "POST",
    body: JSON.stringify({ subject, message }),
  });