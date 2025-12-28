"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import { PlayCircle, BookOpen, ChevronRight } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  content: string;
  orderIndex: number;
  videoUrl: string | null;
  audioUrl: string | null;
  pdfUrl: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  coverUrl: string | null;
  lessons: Lesson[];
}

export default function CourseLearningPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  const handleLessonClick = (lessonId: string) => {
    router.push(`/student/lessons/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Đang tải khóa học...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">
            Không tìm thấy khóa học
          </p>
          <button
            onClick={() => router.push("/student/courses")}
            className="text-primary hover:underline"
          >
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/student/courses")}
            className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary mb-4 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Quay lại khóa học
          </button>

          <div className="bg-gradient-to-r from-primary to-brand-medium rounded-2xl p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {course.coverUrl && (
                <div
                  className="w-full md:w-48 h-32 rounded-xl bg-cover bg-center shadow-md border-2 border-white/20"
                  style={{ backgroundImage: `url('${course.coverUrl}')` }}
                ></div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-black mb-3">{course.title}</h1>
                <p className="text-blue-100 mb-4 leading-relaxed">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} />
                    <span>{course.lessons?.length || 0} bài học</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-brand-medium shadow-sm p-6">
          <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[28px]">
              menu_book
            </span>
            Nội dung khóa học
          </h2>

          {course.lessons && course.lessons.length > 0 ? (
            <div className="space-y-3">
              {course.lessons
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((lesson, index) => (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson.id)}
                    className="group p-5 border border-slate-200 dark:border-brand-medium rounded-xl hover:border-primary hover:shadow-md transition-all cursor-pointer bg-slate-50 dark:bg-brand-dark/30 hover:bg-primary/5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-brand-dark dark:text-white group-hover:text-primary transition-colors">
                            {lesson.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {lesson.videoUrl && (
                              <span className="flex items-center gap-1">
                                <PlayCircle size={14} />
                                Video
                              </span>
                            )}
                            {lesson.content && (
                              <span className="flex items-center gap-1">
                                <BookOpen size={14} />
                                Lý thuyết
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className="text-slate-400 group-hover:text-primary transition-colors"
                        size={24}
                      />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-brand-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-slate-400" size={32} />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Khóa học này chưa có bài học nào
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                Giảng viên đang chuẩn bị nội dung
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
