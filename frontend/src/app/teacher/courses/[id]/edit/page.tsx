"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/utils/api";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";

interface CourseFormData {
  title: string;
  description: string;
  price: number;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "ALL";
  coverUrl?: string;
  status: "DRAFT" | "PUBLISHED";
}

export default function EditCoursePage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    price: 0,
    level: "A1",
    status: "DRAFT",
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setFetching(true);
        const response = await api.get(`/courses/${id}`);
        const course = response.data;

        setFormData({
          title: course.title,
          description: course.description,
          price: course.price,
          level: course.level,
          coverUrl: course.coverUrl,
          status: course.status,
        });

        if (course.coverUrl) {
          setImagePreview(course.coverUrl);
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
        alert("Không thể tải thông tin khóa học");
        router.push("/teacher/courses");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await api.post("/upload/image", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData((prev) => ({
        ...prev,
        coverUrl: response.data.url,
      }));
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Không thể tải ảnh lên. Vui lòng thử lại.");
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      coverUrl: undefined,
    }));
  };

  const handleSubmit = async (isDraft: boolean) => {
    // Validation
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tên khóa học");
      return;
    }

    if (!formData.description.trim()) {
      alert("Vui lòng nhập mô tả khóa học");
      return;
    }

    if (formData.price < 0) {
      alert("Giá khóa học không hợp lệ");
      return;
    }

    try {
      setLoading(true);

      const courseData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        level: formData.level,
        coverUrl: formData.coverUrl,
        status: isDraft ? "DRAFT" : "PUBLISHED",
      };

      await api.patch(`/courses/${id}`, courseData);

      alert("Cập nhật khóa học thành công!");
      router.push(`/teacher/courses/${id}`);
    } catch (error) {
      console.error("Failed to update course:", error);
      const err = error as { response?: { data?: { message?: string } } };
      alert(
        err.response?.data?.message ||
          "Không thể cập nhật khóa học. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin khóa học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push(`/teacher/courses/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chỉnh sửa khóa học
        </h1>
        <p className="text-gray-600">Cập nhật thông tin khóa học của bạn</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Course Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên khóa học <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Ví dụ: Tiếng Anh giao tiếp cho người mới bắt đầu"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Course Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả khóa học <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Mô tả chi tiết về nội dung, mục tiêu và đối tượng học viên của khóa học..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price and Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá khóa học (VNĐ)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              min="0"
              step="1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Để 0 nếu khóa học miễn phí
            </p>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trình độ <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  level: e.target.value as CourseFormData["level"],
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Mọi trình độ</option>
              <option value="A1">A1 - Beginner</option>
              <option value="A2">A2 - Elementary</option>
              <option value="B1">B1 - Intermediate</option>
              <option value="B2">B2 - Upper Intermediate</option>
              <option value="C1">C1 - Advanced</option>
              <option value="C2">C2 - Proficient</option>
            </select>
          </div>
        </div>

        {/* Cover Image */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh bìa khóa học
          </label>

          {imagePreview ? (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={imagePreview}
                alt="Course cover"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Click để tải ảnh lên</p>
              <p className="text-xs text-gray-500">PNG, JPG tối đa 5MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Đang lưu..." : "Lưu nháp"}
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Đang lưu..." : "Lưu & Xuất bản"}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Sau khi cập nhật, bạn có thể quản lý bài học trong trang quản lý khóa
          học
        </p>
      </div>
    </div>
  );
}
