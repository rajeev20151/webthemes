export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Base fetch helper ────────────────────────────────────────
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
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

// ─── Auth APIs ────────────────────────────────────────────────
export const registerAPI = (name, email, password) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const verifyOTPAPI = (email, otp) =>
  request("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });

export const resendOTPAPI = (email) =>
  request("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const loginAPI = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getMeAPI = () =>
  request("/auth/me", { method: "GET" });

export const forgotPasswordAPI = (email) =>
  request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPasswordAPI = (email, otp, password) =>
  request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, otp, password }),
  });

// ─── Template APIs ────────────────────────────────────────────
export const getTemplatesAPI = () =>
  request("/templates", { method: "GET" });

export const getTemplateAPI = (id) =>
  request(`/templates/${id}`, { method: "GET" });

// ─── Chat APIs ────────────────────────────────────────────────
export const getTemplateChatsAPI = (templateId) =>
  request(`/chats/${templateId}`, { method: "GET" });

export const createTemplateChatAPI = (templateId, data) =>
  request(`/chats/${templateId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteTemplateChatAPI = (chatId) =>
  request(`/chats/message/${chatId}`, { method: "DELETE" });

// ─── Review APIs ──────────────────────────────────────────────
export const getAllReviewsAPI = () =>
  request("/reviews/all", { method: "GET" });

export const getTemplateReviewsAPI = (templateId) =>
  request(`/reviews/${templateId}`, { method: "GET" });

export const createTemplateReviewAPI = (templateId, data) =>
  request(`/reviews/${templateId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteTemplateReviewAPI = (reviewId) =>
  request(`/reviews/${reviewId}`, { method: "DELETE" });

// ─── Content API (Public) ─────────────────────────────────────
export const getContentsAPI = () =>
  request("/contents", { method: "GET" });

// ─── Contact API (Public) ──────────────────────────────────────
export const createContactAPI = (data) =>
  request("/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ─── Blog APIs (Public) ───────────────────────────────────────
export const getBlogsAPI = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/blogs${qs ? `?${qs}` : ""}`, { method: "GET" });
};

export const getBlogBySlugAPI = (slug) =>
  request(`/blogs/${slug}`, { method: "GET" });
 
 