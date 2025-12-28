/**
 * Type-Safe API Client
 * Wrapper around Axios với error handling và typing đầy đủ
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse, ApiError } from '@/lib/types/api';

// Tạo axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * Request Interceptor: Tự động gắn token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('access_token') 
      : null;
      
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Xử lý lỗi chung
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle 401: Token expired
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Helper function: Parse error từ Axios
 */
function parseError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';
    const details = error.response?.data?.details;
    
    return { message, status, details };
  }
  
  return {
    message: 'Đã có lỗi không xác định',
    status: 500,
  };
}

/**
 * Type-safe GET request
 */
export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.get<T>(url, config);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: parseError(error) };
  }
}

/**
 * Type-safe POST request
 */
export async function apiPost<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.post<T>(url, data, config);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: parseError(error) };
  }
}

/**
 * Type-safe PUT request
 */
export async function apiPut<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.put<T>(url, data, config);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: parseError(error) };
  }
}

/**
 * Type-safe PATCH request
 */
export async function apiPatch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.patch<T>(url, data, config);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: parseError(error) };
  }
}

/**
 * Type-safe DELETE request
 */
export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.delete<T>(url, config);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: parseError(error) };
  }
}

// Export raw client nếu cần custom
export { apiClient };
