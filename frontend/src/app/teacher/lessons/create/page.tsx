"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { BookOpen, Save, Video, FileText } from "lucide-react";

interface Course {
  id: string;
  title: string;
}

export default function CreateLessonPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    content: "",
    videoUrl: "",
    audioUrl: "",
    pdfUrl: "",
    orderIndex: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  const fetchTeacherCourses = async () => {
    try {
      const res = await api.get("/courses/my-courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.courseId) newErrors.courseId = "Vui lòng chọn khóa học";
    if (!formData.title.trim()) newErrors.title = "Tiêu đề không được để trống";
    if (!formData.content.trim())
      newErrors.content = "Nội dung không được để trống";
    if (formData.orderIndex < 1) newErrors.orderIndex = "Thứ tự phải lớn hơn 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        courseId: formData.courseId,
        title: formData.title,
        content: formData.content,
        videoUrl: formData.videoUrl || undefined,
        audioUrl: formData.audioUrl || undefined,
        pdfUrl: formData.pdfUrl || undefined,
        orderIndex: parseInt(formData.orderIndex.toString()),
      };

      await api.post("/lessons", payload);

      alert("✅ Tạo bài học thành công! Chờ Admin duyệt.");
      router.push("/teacher/dashboard");
    } catch (err: unknown) {
      console.error(err);
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "Có lỗi xảy ra khi tạo bài học");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary mb-4 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Quay lại
          </button>
          <h1 className="text-3xl font-black text-brand-dark dark:text-white flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BookOpen className="text-primary" size={32} />
            </div>
            Tạo Bài Học Mới
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Tạo bài học mới cho khóa học của bạn. Bài học sẽ được gửi đến Admin
            để duyệt.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Selection */}
          <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-brand-medium shadow-sm p-6">
            <h2 className="text-xl font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                school
              </span>
              Thông Tin Cơ Bản
            </h2>

            <div className="space-y-4">
              {/* Course Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-brand-dark dark:text-white mb-2">
                  Khóa học <span className="text-red-500">*</span>
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-brand-dark border ${
                    errors.courseId
                      ? "border-red-500"
                      : "border-slate-200 dark:border-brand-medium"
                  } rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-brand-dark dark:text-white`}
                >
                  <option value="">-- Chọn khóa học --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                {errors.courseId && (
                  <p className="text-red-500 text-xs mt-1">{errors.courseId}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-brand-dark dark:text-white mb-2">
                  Tiêu đề bài học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ví dụ: Bài 1 - Present Simple Tense"
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-brand-dark border ${
                    errors.title
                      ? "border-red-500"
                      : "border-slate-200 dark:border-brand-medium"
                  } rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-brand-dark dark:text-white`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* Order Index */}
              <div>
                <label className="block text-sm font-semibold text-brand-dark dark:text-white mb-2">
                  Thứ tự bài học <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="orderIndex"
                  value={formData.orderIndex}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-brand-dark border ${
                    errors.orderIndex
                      ? "border-red-500"
                      : "border-slate-200 dark:border-brand-medium"
                  } rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-brand-dark dark:text-white`}
                />
                {errors.orderIndex && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.orderIndex}
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Thứ tự hiển thị của bài học (1, 2, 3...)
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-brand-medium shadow-sm p-6">
            <h2 className="text-xl font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
              <FileText className="text-primary" size={24} />
              Nội Dung Bài Học
            </h2>

            <div>
              <label className="block text-sm font-semibold text-brand-dark dark:text-white mb-2">
                Nội dung chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={12}
                placeholder="Nhập nội dung bài học (hỗ trợ HTML)&#10;&#10;Ví dụ:&#10;<h3>1. Định nghĩa</h3>&#10;<p>Present Simple là thì hiện tại đơn...</p>&#10;&#10;<h3>2. Cấu trúc</h3>&#10;<p><strong>Khẳng định:</strong> S + V(s/es)</p>"
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-brand-dark border ${
                  errors.content
                    ? "border-red-500"
                    : "border-slate-200 dark:border-brand-medium"
                } rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-brand-dark dark:text-white font-mono text-sm`}
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content}</p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                💡 Bạn có thể sử dụng HTML để định dạng (
                <code className="bg-slate-100 dark:bg-brand-dark px-1 rounded">
                  &lt;h3&gt;
                </code>
                ,{" "}
                <code className="bg-slate-100 dark:bg-brand-dark px-1 rounded">
                  &lt;p&gt;
                </code>
                ,{" "}
                <code className="bg-slate-100 dark:bg-brand-dark px-1 rounded">
                  &lt;strong&gt;
                </code>
                ,{" "}
                <code className="bg-slate-100 dark:bg-brand-dark px-1 rounded">
                  &lt;ul&gt;
                </code>
                ,{" "}
                <code className="bg-slate-100 dark:bg-brand-dark px-1 rounded">
                  &lt;li&gt;
                </code>
                )
              </p>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-brand-medium shadow-sm p-6">
            <h2 className="text-xl font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
              <Video className="text-primary" size={24} />
              Tài Nguyên Media
            </h2>

            <div className="space-y-4">
              {/* Video URL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark dark:text-white mb-2">
                  <Video size={16} className="text-slate-500" />
                  URL Video (tùy chọn)
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-brand-dark border border-slate-200 dark:border-brand-medium rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-brand-dark dark:text-white"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Link video bài giảng (mp4, YouTube embed, v.v.)
                </p>
              </div>

              {/* Audio URL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark dark:text-white mb-2">
                  <span className="material-symbols-outlined text-[16px] text-slate-500">
                    volume_up
                  </span>
                  URL Audio (tùy chọn)
                </label>
                <input
                  type="url"
                  name="audioUrl"
                  value={formData.audioUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/audio.mp3"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-brand-dark border border-slate-200 dark:border-brand-medium rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-brand-dark dark:text-white"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Link audio bài giảng (mp3, wav, v.v.)
                </p>
              </div>

              {/* PDF URL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark dark:text-white mb-2">
                  <FileText size={16} className="text-slate-500" />
                  URL PDF (tùy chọn)
                </label>
                <input
                  type="url"
                  name="pdfUrl"
                  value={formData.pdfUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/document.pdf"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-brand-dark border border-slate-200 dark:border-brand-medium rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-brand-dark dark:text-white"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Link tài liệu PDF bài giảng
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] mt-0.5">
                    info
                  </span>
                  <span>
                    <strong>Lưu ý:</strong> Sau khi tạo bài học, bạn có thể tải
                    lên tài liệu PDF/Video/Audio trong trang quản lý khóa học.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-6 border-t border-slate-200 dark:border-brand-medium">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-white dark:bg-card-dark border border-slate-200 dark:border-brand-medium text-brand-dark dark:text-white font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-brand-dark transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-lg transition-all flex items-center gap-2 ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Tạo bài học
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[28px]">
              admin_panel_settings
            </span>
            <div>
              <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2">
                Quy trình duyệt bài học
              </h3>
              <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                <li>
                  1. Bài học sau khi tạo sẽ có trạng thái{" "}
                  <strong>PENDING</strong> (Chờ duyệt)
                </li>
                <li>2. Admin sẽ xem xét và duyệt bài học</li>
                <li>
                  3. Sau khi được duyệt, học viên mới có thể xem được bài học
                </li>
                <li>
                  4. Bạn có thể xem trạng thái trong trang quản lý khóa học
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
