/**
 * User & Authentication Types
 */

export type UserRole = 'ADMIN' | 'LECTURER' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  points?: number;
  streak?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  username: string;
  role?: UserRole;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
