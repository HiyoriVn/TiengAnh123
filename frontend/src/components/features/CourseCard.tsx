/**
 * CourseCard Component
 * Display course information in card format
 */

"use client";

import Link from "next/link";
import type { Course } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { User, BookOpen } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 h-full flex flex-col">
        {/* Course Image */}
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
          {course.coverUrl ? (
            <img
              src={course.coverUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-blue-300" />
            </div>
          )}
        </div>

        {/* Course Info */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {course.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <User className="w-3.5 h-3.5" />
              <span className="truncate">{course.creator.fullName}</span>
            </div>

            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(course.price)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
