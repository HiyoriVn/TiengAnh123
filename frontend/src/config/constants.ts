/**
 * Application Constants
 * Định nghĩa tất cả constants dùng trong app
 */

export const APP_NAME = "TiengAnh123";
export const APP_DESCRIPTION = "Nền tảng học tiếng Anh hiệu quả";

export const API_TIMEOUT = 30000; // 30 seconds

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER_INFO: "user_info",
  THEME: "theme",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  COURSES: "/courses",
  MY_COURSES: "/my-courses",
  STUDENT_DASHBOARD: "/student/dashboard",
  TEACHER_DASHBOARD: "/teacher/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
} as const;

export const USER_ROLES = {
  ADMIN: "ADMIN",
  LECTURER: "LECTURER",
  STUDENT: "STUDENT",
} as const;

export const COURSE_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export const QUERY_KEYS = {
  COURSES: "courses",
  COURSE_DETAIL: "course-detail",
  USER: "user",
  ENROLLMENTS: "enrollments",
} as const;
