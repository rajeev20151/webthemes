import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token || localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const API_URL = API_BASE;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Auth", "Template", "Blog", "Review", "Chat", "Content", "Contact", "Cart"],

  endpoints: (builder) => ({

    // ─── AUTH ────────────────────────────────────────
    register: builder.mutation({
      query: (data) => ({ url: "/auth/register", method: "POST", body: data }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({ url: "/auth/verify-otp", method: "POST", body: data }),
    }),
    resendOTP: builder.mutation({
      query: (data) => ({ url: "/auth/resend-otp", method: "POST", body: data }),
    }),
    login: builder.mutation({
      query: (data) => ({ url: "/auth/login", method: "POST", body: data }),
    }),
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({ url: "/auth/forgot-password", method: "POST", body: data }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({ url: "/auth/reset-password", method: "POST", body: data }),
    }),

    // ─── TEMPLATES ───────────────────────────────────
    getTemplates: builder.query({
      query: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return `/templates${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Template"],
    }),
    getTemplate: builder.query({
      query: (slugOrId) => `/templates/${slugOrId}`,
      providesTags: (result, error, slugOrId) => [{ type: "Template", id: slugOrId }],
    }),
    getPopularTemplates: builder.query({
      query: (limit = 9) => `/templates/popular?limit=${limit}`,
      providesTags: ["Template"],
    }),
    getRelatedTemplates: builder.query({
      query: ({ category, excludeId, limit = 6 }) => {
        const params = new URLSearchParams({ category, excludeId, limit }).toString();
        return `/templates/related?${params}`;
      },
      providesTags: ["Template"],
    }),
    getTemplatesRatings: builder.query({
      query: (ids) => `/templates/ratings?ids=${ids.join(",")}`,
    }),
    incrementViews: builder.mutation({
      query: (id) => ({ url: `/templates/${id}/views`, method: "POST" }),
    }),

    // ─── BLOGS ───────────────────────────────────────
    getBlogs: builder.query({
      query: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return `/blogs${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Blog"],
    }),
    getBlogBySlug: builder.query({
      query: (slug) => `/blogs/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Blog", id: slug }],
    }),

    // ─── REVIEWS ─────────────────────────────────────
    getAllReviews: builder.query({
      query: () => "/reviews/all",
      providesTags: ["Review"],
    }),
    getTemplateReviews: builder.query({
      query: (templateId) => `/reviews/${templateId}`,
      providesTags: (result, error, templateId) => [{ type: "Review", id: templateId }],
    }),
    createReview: builder.mutation({
      query: ({ templateId, ...data }) => ({
        url: `/reviews/${templateId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { templateId }) => [
        { type: "Review", id: templateId },
      ],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({ url: `/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: ["Review"],
    }),

    // ─── CHATS ───────────────────────────────────────
    getTemplateChats: builder.query({
      query: (templateId) => `/chats/${templateId}`,
      providesTags: (result, error, templateId) => [{ type: "Chat", id: templateId }],
    }),
    createChat: builder.mutation({
      query: ({ templateId, ...data }) => ({
        url: `/chats/${templateId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { templateId }) => [
        { type: "Chat", id: templateId },
      ],
    }),
    deleteChat: builder.mutation({
      query: (chatId) => ({ url: `/chats/message/${chatId}`, method: "DELETE" }),
      invalidatesTags: ["Chat"],
    }),

    // ─── CONTENT ─────────────────────────────────────
    getContents: builder.query({
      query: () => "/contents",
      providesTags: ["Content"],
    }),

    // ─── CONTACT ─────────────────────────────────────
    createContact: builder.mutation({
      query: (data) => ({ url: "/contacts", method: "POST", body: data }),
      invalidatesTags: ["Contact"],
    }),

    // ─── CART ────────────────────────────────────────
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addToCartApi: builder.mutation({
      query: (data) => ({ url: "/cart/add", method: "POST", body: data }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCartApi: builder.mutation({
      query: (templateId) => ({ url: `/cart/${templateId}`, method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
    clearCartApi: builder.mutation({
      query: () => ({ url: "/cart", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
    mergeCartApi: builder.mutation({
      query: (items) => ({ url: "/cart/merge", method: "POST", body: { items } }),
      invalidatesTags: ["Cart"],
    }),

    // ─── NEWSLETTER ──────────────────────────────────
    subscribeNewsletter: builder.mutation({
      query: (data) => ({ url: "/newsletter/subscribe", method: "POST", body: data }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useLoginMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetTemplatesQuery,
  useLazyGetTemplatesQuery,
  useGetTemplateQuery,
  useGetPopularTemplatesQuery,
  useGetRelatedTemplatesQuery,
  useGetTemplatesRatingsQuery,
  useIncrementViewsMutation,
  useGetBlogsQuery,
  useGetBlogBySlugQuery,
  useGetAllReviewsQuery,
  useGetTemplateReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetTemplateChatsQuery,
  useCreateChatMutation,
  useDeleteChatMutation,
  useGetContentsQuery,
  useCreateContactMutation,
  useGetCartQuery,
  useAddToCartApiMutation,
  useRemoveFromCartApiMutation,
  useClearCartApiMutation,
  useMergeCartApiMutation,
  useSubscribeNewsletterMutation,
} = apiSlice;
