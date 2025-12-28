/**
 * Utility Helper Functions
 * Các hàm tiện ích dùng chung trong app
 */

import type { UserRole } from "@/lib/types";
import { ROUTES } from "@/config";

/**
 * Format số tiền VND
 */
export function formatCurrency(amount: number): string {
  if (amount === 0) return "Miễn phí";
  return `${amount.toLocaleString("vi-VN")} đ`;
}

/**
 * Format thời gian (duration)
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} phút`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hours} giờ`;
  return `${hours} giờ ${remainingMinutes} phút`;
}

/**
 * Truncate text với ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Get dashboard route theo role
 */
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return ROUTES.ADMIN_DASHBOARD;
    case "LECTURER":
      return ROUTES.TEACHER_DASHBOARD;
    case "STUDENT":
      return ROUTES.STUDENT_DASHBOARD;
    default:
      return ROUTES.HOME;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sleep utility (for testing)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Class names utility (simple version)
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}
