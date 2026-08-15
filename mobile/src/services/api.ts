import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Use EXPO_PUBLIC_API_URL if defined, otherwise fallback to localhost
// For Android emulator, use http://10.0.2.2:8080/api locally
// For production, this will be your Render backend URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api';

export const quickKartApi = createApi({
  reducerPath: 'quickKartApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Address', 'Product', 'Order', 'Content', 'Review'],
  endpoints: (builder) => ({
    getProducts: builder.query<any[], void>({
      query: () => '/products',
    }),
    getProductById: builder.query<any, string>({
      query: (id) => `/products/${id}`,
    }),
    getAddresses: builder.query<any[], void>({
      query: () => '/addresses',
      providesTags: ['Address'],
    }),
    addAddress: builder.mutation<any, any>({
      query: (address) => ({
        url: '/addresses',
        method: 'POST',
        body: address,
      }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: builder.mutation<void, number>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    sendRegistrationOtp: builder.mutation<any, string>({
      query: (email) => ({
        url: '/auth/register/send-otp',
        method: 'POST',
        body: { email },
      }),
    }),
    sendForgotPasswordOtp: builder.mutation<any, string>({
      query: (email) => ({
        url: '/auth/forgot-password/send-otp',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/auth/forgot-password/reset',
        method: 'POST',
        body: credentials,
      }),
    }),
    sendOtp: builder.mutation<any, any>({
      query: (email) => ({
        url: '/auth/otp/send',
        method: 'POST',
        body: { email },
      }),
    }),
    verifyOtp: builder.mutation<any, any>({
      query: (data) => ({
        url: '/auth/otp/verify',
        method: 'POST',
        body: data,
      }),
    }),
    applyToBeSeller: builder.mutation<any, void>({
      query: () => ({
        url: '/seller/apply',
        method: 'POST',
      }),
    }),
    updateProfile: builder.mutation<any, { name: string; phone: string }>({
      query: (data) => ({
        url: '/user/profile',
        method: 'PUT',
        body: data,
      }),
    }),
    getPendingSellers: builder.query<any[], void>({
      query: () => '/admin/sellers/pending',
    }),
    approveSeller: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin/sellers/approve/${id}`,
        method: 'POST',
      }),
    }),
    getSellerProducts: builder.query<any[], void>({
      query: () => '/seller/products',
      providesTags: ['Product'],
    }),
    addSellerProduct: builder.mutation<any, any>({
      query: (product) => ({
        url: '/seller/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateSellerProduct: builder.mutation<any, {id: number, product: any}>({
      query: ({id, product}) => ({
        url: `/seller/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteSellerProduct: builder.mutation<any, number>({
      query: (id) => ({
        url: `/seller/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    getCustomerOrders: builder.query<any[], void>({
      query: () => '/orders/my-orders',
      providesTags: ['Order'],
    }),
    confirmOrder: builder.mutation<any, any>({
      query: (orderData) => ({
        url: '/orders/confirm',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),
    getSellerAnalytics: builder.query<any, void>({
      query: () => '/seller/products/analytics',
      providesTags: ['Order'],
    }),
    getBanners: builder.query<any[], void>({
      query: () => '/content/banners',
      providesTags: ['Content'],
    }),
    getActiveBanners: builder.query<any[], void>({
      query: () => '/content/banners/active',
      providesTags: ['Content'],
    }),
    addBanner: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: '/content/banners',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Content'],
    }),
    deleteBanner: builder.mutation<void, number>({
      query: (id) => ({
        url: `/content/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Content'],
    }),
    getCategories: builder.query<any[], void>({
      query: () => '/content/categories',
      providesTags: ['Content'],
    }),
    addCategory: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: '/content/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Content'],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/content/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Content'],
    }),
    getSellerOrders: builder.query<any[], void>({
      query: () => '/seller/orders',
      providesTags: ['Order'],
    }),
    updateSellerOrderStatus: builder.mutation<any, {id: number, status: string}>({
      query: ({id, status}) => ({
        url: `/seller/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
    getProductReviews: builder.query<any[], string>({
      query: (productId) => `/products/${productId}/reviews`,
      providesTags: (result, error, productId) => [{ type: 'Review', id: productId }],
    }),
    addProductReview: builder.mutation<any, { productId: string, review: { rating: number, comment: string, reviewerName: string } }>({
      query: ({ productId, review }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: review,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Review', id: productId }],
    }),
    searchProducts: builder.query<any[], string>({
      query: (q) => `/products/search?q=${encodeURIComponent(q)}`,
      providesTags: ['Product'],
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductByIdQuery,
  useGetAddressesQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useLoginMutation,
  useRegisterMutation,
  useSendRegistrationOtpMutation,
  useSendForgotPasswordOtpMutation,
  useResetPasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useApplyToBeSellerMutation,
  useUpdateProfileMutation,
  useGetPendingSellersQuery,
  useApproveSellerMutation,
  useGetSellerProductsQuery,
  useAddSellerProductMutation,
  useUpdateSellerProductMutation,
  useDeleteSellerProductMutation,
  useGetCustomerOrdersQuery,
  useConfirmOrderMutation,
  useGetSellerAnalyticsQuery,
  useGetBannersQuery,
  useGetActiveBannersQuery,
  useAddBannerMutation,
  useDeleteBannerMutation,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetSellerOrdersQuery,
  useUpdateSellerOrderStatusMutation,
  useGetProductReviewsQuery,
  useAddProductReviewMutation,
  useSearchProductsQuery,
} = quickKartApi;
