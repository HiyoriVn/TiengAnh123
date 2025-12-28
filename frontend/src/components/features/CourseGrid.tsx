/**
 * CourseGrid Component
 * Grid layout for displaying courses
 */

"use client";

import type { Course } from "@/lib/types";
import { CourseCard } from "./CourseCard";

interface CourseGridProps {
  courses: Course[];
}

export function CourseGrid({ courses }: CourseGridProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Chưa có khóa học nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
