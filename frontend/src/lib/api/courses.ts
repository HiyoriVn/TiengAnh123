/**
 * Courses API Functions
 * Tất cả API calls liên quan đến courses & lessons
 */

import { apiGet, apiPost } from './client';
import type { Course, CourseDetail } from '@/lib/types';

/**
 * Lấy danh sách tất cả khóa học
 */
export async function getCourses() {
  return apiGet<Course[]>('/courses');
}

/**
 * Lấy chi tiết 1 khóa học
 */
export async function getCourseById(id: string) {
  return apiGet<CourseDetail>(`/courses/${id}`);
}

/**
 * Kiểm tra user đã enroll khóa học chưa
 */
export async function checkEnrollment(courseId: string) {
  return apiGet<{ enrolled: boolean }>(`/enrollments/check/${courseId}`);
}

/**
 * Đăng ký khóa học
 */
export async function enrollCourse(courseId: string) {
  return apiPost<{ message: string }>('/enrollments', { courseId });
}
