"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { ArrowLeft, Upload, X } from "lucide-react";

interface CourseFormData {
  title: string;
  description: string;
  price: number;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "ALL";
  coverImage?: string;
  isPublished: boolean;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    price: 0,
    level: "A1",
    isPublished: false,
  });

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
        coverImage: response.data.url,
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
      coverImage: undefined,
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
        coverUrl: formData.coverImage, // Map coverImage to coverUrl for backend
        status: isDraft ? "DRAFT" : "PUBLISHED", // Map isPublished to status
      };

      const response = await api.post("/courses", courseData);

      alert(
        isDraft
          ? "Lưu bản nháp thành công!"
          : "Tạo khóa học thành công và đã xuất bản!"
      );

      // Redirect to edit page to add lessons
      router.push(`/teacher/courses/${response.data.id}`);
    } catch (error) {
      console.error("Failed to create course:", error);
      const err = error as { response?: { data?: { message?: string } } };
      alert(
        err.response?.data?.message ||
          "Không thể tạo khóa học. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tạo khóa học mới
        </h1>
        <p className="text-gray-600">
          Điền thông tin cơ bản về khóa học của bạn
        </p>
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
          <p className="mt-1 text-sm text-gray-500">
            Mô tả hấp dẫn sẽ giúp thu hút nhiều học viên hơn
          </p>
        </div>

        {/* Course Level */}
        <div className="mb-6">
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
            <option value="A1">A1 - Beginner (Sơ cấp)</option>
            <option value="A2">A2 - Elementary (Cơ bản)</option>
            <option value="B1">B1 - Intermediate (Trung cấp)</option>
            <option value="B2">B2 - Upper Intermediate (Trung cấp cao)</option>
            <option value="C1">C1 - Advanced (Nâng cao)</option>
            <option value="C2">C2 - Proficient (Thành thạo)</option>
            <option value="ALL">Tất cả trình độ</option>
          </select>
        </div>

        {/* Course Price */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giá khóa học (VNĐ) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            placeholder="0"
            min="0"
            step="10000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Nhập 0 nếu khóa học miễn phí
          </p>
        </div>

        {/* Course Cover Image */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh bìa khóa học
          </label>

          {imagePreview ? (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
            <div className="relative">
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="coverImage"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Tải ảnh bìa lên
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF - Tối đa 5MB
                </p>
              </label>
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Ảnh bìa đẹp sẽ thu hút học viên nhiều hơn
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang lưu..." : "Lưu bản nháp"}
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang tạo..." : "Tạo và xuất bản"}
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Bạn có thể thêm bài học và tài liệu sau khi tạo khóa học
        </p>
      </div>
    </div>
  );
}
