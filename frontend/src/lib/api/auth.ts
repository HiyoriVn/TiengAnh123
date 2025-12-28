/**
 * Auth API Functions
 * Tất cả API calls liên quan đến authentication
 */

import { apiPost } from './client';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/lib/types';

/**
 * Đăng nhập
 */
export async function login(credentials: LoginCredentials) {
  return apiPost<AuthResponse>('/auth/login', credentials);
}

/**
 * Đăng ký tài khoản mới
 */
export async function register(data: RegisterData) {
  return apiPost<AuthResponse>('/auth/register', data);
}

/**
 * Lấy thông tin user hiện tại (verify token)
 */
export async function getCurrentUser() {
  return apiPost<User>('/auth/me');
}

/**
 * Đăng xuất (nếu backend có endpoint)
 */
export async function logout() {
  return apiPost<{ message: string }>('/auth/logout');
}
