"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

interface Course {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  title: string;
  courseId: string;
}

interface Question {
  question: string;
  type:
    | "MULTIPLE_CHOICE"
    | "TRUE_FALSE"
    | "FILL_BLANK"
    | "MATCHING"
    | "SHORT_ANSWER";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  orderIndex: number;
}

export default function CreateExercisePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  // Exercise form
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"PRACTICE" | "QUIZ" | "HOMEWORK">(
    "PRACTICE"
  );
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [passingScore, setPassingScore] = useState(70);
  const [orderIndex, setOrderIndex] = useState(1);

  // Questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      type: "MULTIPLE_CHOICE",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      points: 1,
      orderIndex: 1,
    },
  ]);

  // Load courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses/my-courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to load courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Load lessons when course is selected
  useEffect(() => {
    if (!selectedCourse) {
      setLessons([]);
      setSelectedLesson("");
      return;
    }

    const fetchLessons = async () => {
      try {
        const response = await api.get(`/lessons/course/${selectedCourse}`);
        setLessons(response.data);
      } catch (error) {
        console.error("Failed to load lessons:", error);
      }
    };

    fetchLessons();
  }, [selectedCourse]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "MULTIPLE_CHOICE",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
        points: 1,
        orderIndex: questions.length + 1,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    // Update orderIndex
    newQuestions.forEach((q, i) => {
      q.orderIndex = i + 1;
    });
    setQuestions(newQuestions);
  };

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | number | string[] | undefined
  ) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value,
    };
    setQuestions(newQuestions);
  };

  const updateQuestionOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    const options = [...(newQuestions[questionIndex].options || [])];
    options[optionIndex] = value;
    newQuestions[questionIndex].options = options;
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    const options = [...(newQuestions[questionIndex].options || [])];
    options.push("");
    newQuestions[questionIndex].options = options;
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    const options = (newQuestions[questionIndex].options || []).filter(
      (_, i) => i !== optionIndex
    );
    newQuestions[questionIndex].options = options;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLesson) {
      alert("Vui lòng chọn bài học");
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`Câu hỏi ${i + 1}: Vui lòng nhập nội dung câu hỏi`);
        return;
      }
      if (!q.correctAnswer.trim()) {
        alert(`Câu hỏi ${i + 1}: Vui lòng nhập đáp án đúng`);
        return;
      }
      if (
        (q.type === "MULTIPLE_CHOICE" || q.type === "MATCHING") &&
        (!q.options || q.options.length < 2)
      ) {
        alert(`Câu hỏi ${i + 1}: Cần ít nhất 2 lựa chọn`);
        return;
      }
    }

    setLoading(true);
    try {
      await api.post("/exercises", {
        lessonId: selectedLesson,
        title,
        description,
        type,
        timeLimit,
        passingScore,
        orderIndex,
        questions: questions.map((q) => ({
          question: q.question,
          type: q.type,
          options:
            q.type === "MULTIPLE_CHOICE" || q.type === "MATCHING"
              ? q.options
              : undefined,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points,
          orderIndex: q.orderIndex,
        })),
      });

      alert("Tạo bài tập thành công!");
      router.push("/teacher/lessons");
    } catch (error: unknown) {
      console.error("Failed to create exercise:", error);
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Tạo bài tập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionInput = (question: Question, index: number) => {
    switch (question.type) {
      case "MULTIPLE_CHOICE":
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Các lựa chọn:
            </label>
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 w-6">
                  {String.fromCharCode(65 + optionIndex)}.
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) =>
                    updateQuestionOption(index, optionIndex, e.target.value)
                  }
                  placeholder={`Lựa chọn ${String.fromCharCode(
                    65 + optionIndex
                  )}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {(question.options?.length || 0) > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index, optionIndex)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(index)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Thêm lựa chọn
            </button>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đáp án đúng (A, B, C, ...):
              </label>
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) =>
                  updateQuestion(
                    index,
                    "correctAnswer",
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="Ví dụ: A"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case "TRUE_FALSE":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đáp án đúng:
            </label>
            <select
              value={question.correctAnswer}
              onChange={(e) =>
                updateQuestion(index, "correctAnswer", e.target.value)
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn đáp án</option>
              <option value="true">Đúng</option>
              <option value="false">Sai</option>
            </select>
          </div>
        );

      case "FILL_BLANK":
      case "SHORT_ANSWER":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đáp án đúng:
            </label>
            <input
              type="text"
              value={question.correctAnswer}
              onChange={(e) =>
                updateQuestion(index, "correctAnswer", e.target.value)
              }
              placeholder="Nhập đáp án đúng"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case "MATCHING":
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Các cặp (để hiển thị cho học viên):
            </label>
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) =>
                    updateQuestionOption(index, optionIndex, e.target.value)
                  }
                  placeholder={`Cặp ${optionIndex + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {(question.options?.length || 0) > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index, optionIndex)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(index)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Thêm cặp
            </button>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đáp án đúng (JSON format):
              </label>
              <textarea
                value={question.correctAnswer}
                onChange={(e) =>
                  updateQuestion(index, "correctAnswer", e.target.value)
                }
                placeholder='{"1": "A", "2": "B", "3": "C"}'
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ví dụ: {`{"1": "A", "2": "B"}`} nghĩa là cặp 1 nối với A, cặp 2
                nối với B
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tạo Bài Tập Mới</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Thông tin cơ bản
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khóa học <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn khóa học</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bài học <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                required
                disabled={!selectedCourse}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Chọn bài học</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ví dụ: Bài tập luyện từ vựng Unit 1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Mô tả ngắn gọn về bài tập..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại bài tập
              </label>
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "PRACTICE" | "QUIZ" | "HOMEWORK")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PRACTICE">Luyện tập</option>
                <option value="QUIZ">Kiểm tra</option>
                <option value="HOMEWORK">Bài tập về nhà</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian (phút)
              </label>
              <input
                type="number"
                value={timeLimit || ""}
                onChange={(e) =>
                  setTimeLimit(e.target.value ? parseInt(e.target.value) : null)
                }
                placeholder="Không giới hạn"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm đạt (%)
              </label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value))}
                min="0"
                max="100"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thứ tự
              </label>
              <input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(parseInt(e.target.value))}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Câu hỏi</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Thêm câu hỏi
            </button>
          </div>

          {questions.map((question, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Câu hỏi {index + 1}
                </h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🗑️ Xóa
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung câu hỏi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(index, "question", e.target.value)
                  }
                  required
                  rows={2}
                  placeholder="Nhập nội dung câu hỏi..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại câu hỏi
                  </label>
                  <select
                    value={question.type}
                    onChange={(e) => {
                      const newType = e.target.value as Question["type"];
                      updateQuestion(index, "type", newType);
                      // Reset options and correctAnswer when changing type
                      if (newType === "MULTIPLE_CHOICE") {
                        updateQuestion(index, "options", ["", "", "", ""]);
                        updateQuestion(index, "correctAnswer", "");
                      } else if (newType === "MATCHING") {
                        updateQuestion(index, "options", ["", ""]);
                        updateQuestion(index, "correctAnswer", "");
                      } else {
                        updateQuestion(index, "options", undefined);
                        updateQuestion(index, "correctAnswer", "");
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
                    <option value="TRUE_FALSE">Đúng/Sai</option>
                    <option value="FILL_BLANK">Điền khuyết</option>
                    <option value="MATCHING">Nối cặp</option>
                    <option value="SHORT_ANSWER">Trả lời ngắn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điểm số
                  </label>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) =>
                      updateQuestion(
                        index,
                        "points",
                        parseFloat(e.target.value)
                      )
                    }
                    min="0.1"
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thứ tự
                  </label>
                  <input
                    type="number"
                    value={question.orderIndex}
                    onChange={(e) =>
                      updateQuestion(
                        index,
                        "orderIndex",
                        parseInt(e.target.value)
                      )
                    }
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {renderQuestionInput(question, index)}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giải thích (hiển thị sau khi nộp bài)
                </label>
                <textarea
                  value={question.explanation}
                  onChange={(e) =>
                    updateQuestion(index, "explanation", e.target.value)
                  }
                  rows={2}
                  placeholder="Giải thích đáp án đúng..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Đang tạo..." : "Tạo bài tập"}
          </button>
        </div>
      </form>
    </div>
  );
}
