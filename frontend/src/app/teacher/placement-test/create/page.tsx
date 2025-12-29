"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

type QuestionType =
  | "MULTIPLE_CHOICE"
  | "FILL_BLANK"
  | "TRUE_FALSE"
  | "MATCHING"
  | "REWRITE";
type QuestionSkill = "LISTENING" | "READING" | "GRAMMAR" | "VOCABULARY";

interface Question {
  questionText: string;
  questionType: QuestionType;
  skill: QuestionSkill;
  order: number;
  points: number;
  options?: string[];
  correctAnswer: string;
  mediaUrl?: string;
  explanation?: string;
}

export default function TeacherCreatePlacementTestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("Bài kiểm tra đánh giá trình độ");
  const [description, setDescription] = useState(
    "Bài kiểm tra gồm 20 câu hỏi đa dạng để xác định trình độ tiếng Anh của bạn"
  );
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    questionText: "",
    questionType: "MULTIPLE_CHOICE",
    skill: "GRAMMAR",
    order: 1,
    points: 1,
    options: ["", "", "", ""],
    correctAnswer: "",
    mediaUrl: "",
    explanation: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleAddQuestion = () => {
    if (!currentQuestion.questionText || !currentQuestion.correctAnswer) {
      alert("Vui lòng điền đầy đủ câu hỏi và đáp án đúng");
      return;
    }

    setQuestions([
      ...questions,
      { ...currentQuestion, order: questions.length + 1 },
    ]);
    setCurrentQuestion({
      questionText: "",
      questionType: "MULTIPLE_CHOICE",
      skill: "GRAMMAR",
      order: questions.length + 2,
      points: 1,
      options: ["", "", "", ""],
      correctAnswer: "",
      mediaUrl: "",
      explanation: "",
    });
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated.map((q, i) => ({ ...q, order: i + 1 })));
  };

  const handleSubmit = async () => {
    if (questions.length < 10) {
      alert("Bài kiểm tra phải có ít nhất 10 câu hỏi");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/placement-test", {
        title,
        description,
        duration,
        totalQuestions: questions.length,
        questions,
      });

      alert("Tạo bài kiểm tra thành công!");
      router.push("/teacher/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(
        err.response?.data?.message || "Có lỗi xảy ra khi tạo bài kiểm tra"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-deep-blue">
          Tạo bài kiểm tra đánh giá trình độ
        </h1>
        <p className="text-ocean-blue mt-1">
          Tạo bài kiểm tra để đánh giá trình độ học viên
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Test Info & Question Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Info */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-deep-blue mb-4">
              Thông tin bài kiểm tra
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ocean-blue mb-1">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-blue mb-1">
                  Mô tả
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20 outline-none resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-blue mb-1">
                  Thời gian (phút)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={10}
                  max={120}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Question Form */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-deep-blue mb-4">
              Thêm câu hỏi mới
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ocean-blue mb-1">
                    Loại câu hỏi
                  </label>
                  <select
                    value={currentQuestion.questionType}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        questionType: e.target.value as QuestionType,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20 outline-none"
                  >
                    <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
                    <option value="FILL_BLANK">Điền từ</option>
                    <option value="TRUE_FALSE">Đúng/Sai</option>
                    <option value="MATCHING">Nối</option>
                    <option value="REWRITE">Viết lại câu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-blue mb-1">
                    Kỹ năng
                  </label>
                  <select
                    value={currentQuestion.skill}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        skill: e.target.value as QuestionSkill,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20 outline-none"
                  >
                    <option value="LISTENING">Nghe</option>
                    <option value="READING">Đọc</option>
                    <option value="GRAMMAR">Ngữ pháp</option>
                    <option value="VOCABULARY">Từ vựng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ocean-blue mb-1">
                  Câu hỏi
                </label>
                <textarea
                  value={currentQuestion.questionText}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      questionText: e.target.value,
                    })
                  }
                  placeholder="Nhập nội dung câu hỏi..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20 outline-none resize-none"
                  rows={3}
                />
              </div>

              {currentQuestion.questionType === "MULTIPLE_CHOICE" && (
                <div>
                  <label className="block text-sm font-medium text-ocean-blue mb-2">
                    Các đáp án (A, B, C, D)
                  </label>
                  <div className="space-y-2">
                    {["A", "B", "C", "D"].map((label, index) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="w-8 text-center font-bold text-ocean-blue">
                          {label}.
                        </span>
                        <input
                          type="text"
                          value={currentQuestion.options?.[index] || ""}
                          onChange={(e) => {
                            const newOptions = [
                              ...(currentQuestion.options || ["", "", "", ""]),
                            ];
                            newOptions[index] = e.target.value;
                            setCurrentQuestion({
                              ...currentQuestion,
                              options: newOptions,
                            });
                          }}
                          placeholder={`Đáp án ${label}`}
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-ocean-blue mb-1">
                  Đáp án đúng{" "}
                  {currentQuestion.questionType === "MULTIPLE_CHOICE" &&
                    "(A, B, C, hoặc D)"}
                </label>
                <input
                  type="text"
                  value={currentQuestion.correctAnswer}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer: e.target.value,
                    })
                  }
                  placeholder={
                    currentQuestion.questionType === "MULTIPLE_CHOICE"
                      ? "Ví dụ: A"
                      : currentQuestion.questionType === "TRUE_FALSE"
                      ? "true hoặc false"
                      : "Nhập đáp án đúng"
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20 outline-none"
                />
              </div>

              {currentQuestion.skill === "LISTENING" && (
                <div>
                  <label className="block text-sm font-medium text-ocean-blue mb-1">
                    URL file audio (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={currentQuestion.mediaUrl}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        mediaUrl: e.target.value,
                      })
                    }
                    placeholder="https://example.com/audio.mp3"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20 outline-none"
                  />
                </div>
              )}

              <button
                onClick={handleAddQuestion}
                className="w-full py-3 bg-teal-blue hover:bg-ocean-blue text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add_circle</span>
                <span>Thêm câu hỏi</span>
              </button>
            </div>
          </section>
        </div>

        {/* Right: Questions List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-xl font-bold text-deep-blue mb-4">
              Danh sách câu hỏi ({questions.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto mb-4">
              {questions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  Chưa có câu hỏi nào
                </p>
              ) : (
                questions.map((q, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-deep-blue truncate">
                        {index + 1}. {q.questionText}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-teal-blue/10 text-teal-blue px-2 py-0.5 rounded">
                          {q.skill}
                        </span>
                        <span className="text-xs bg-ocean-blue/10 text-ocean-blue px-2 py-0.5 rounded">
                          {q.questionType}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveQuestion(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        delete
                      </span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || questions.length < 10}
              className="w-full py-3 bg-primary hover:bg-orange-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">save</span>
              <span>{submitting ? "Đang lưu..." : "Lưu bài kiểm tra"}</span>
            </button>
            {questions.length < 10 && (
              <p className="text-xs text-red-500 text-center mt-2">
                Cần ít nhất 10 câu hỏi
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
