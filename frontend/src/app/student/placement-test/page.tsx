"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

interface Question {
  id: string;
  questionText: string;
  questionType:
    | "MULTIPLE_CHOICE"
    | "FILL_BLANK"
    | "TRUE_FALSE"
    | "MATCHING"
    | "REWRITE";
  skill: string;
  order: number;
  points: number;
  options?: string[];
  mediaUrl?: string;
}

interface PlacementTest {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  questions: Question[];
}

export default function StudentPlacementTestPage() {
  const router = useRouter();
  const [test, setTest] = useState<PlacementTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchTest();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const fetchTest = async () => {
    try {
      // Check eligibility first
      const eligibleRes = await api.get("/placement-test/check-eligibility");
      if (!eligibleRes.data.canTake) {
        alert(
          eligibleRes.data.message || "Bạn đã hoàn thành bài kiểm tra này."
        );
        router.push("/student/courses");
        return;
      }

      // Fetch active test
      const testRes = await api.get("/placement-test/active");
      setTest(testRes.data);
      setTimeLeft(testRes.data.duration * 60);
      startTimeRef.current = Date.now();

      // Start timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Không thể tải bài kiểm tra");
      router.push("/student/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!test) return;

    if (!autoSubmit) {
      const confirmed = window.confirm(
        "Bạn có chắc chắn muốn nộp bài? Bạn sẽ không thể thay đổi câu trả lời sau khi nộp."
      );
      if (!confirmed) return;
    }

    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);

      await api.post("/placement-test/submit", {
        testId: test.id,
        answers,
        timeTaken,
      });

      router.push("/student/placement-test/result");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Có lỗi xảy ra khi nộp bài");
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgress = () => {
    if (!test) return 0;
    return Math.round(((currentQuestionIndex + 1) / test.totalQuestions) * 100);
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const currentQuestion = test?.questions[currentQuestionIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-ocean-blue">Đang tải bài kiểm tra...</p>
        </div>
      </div>
    );
  }

  if (!test || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-ocean-blue">Không tìm thấy bài kiểm tra</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Timer Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-teal-blue">
            timer
          </span>
          <span
            className={`font-bold font-mono text-lg ${
              timeLeft < 300 ? "text-red-500" : "text-deep-blue"
            }`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
        <button
          onClick={() => {
            if (
              window.confirm(
                "Bạn có chắc muốn thoát? Tiến trình sẽ không được lưu."
              )
            ) {
              router.push("/student/courses");
            }
          }}
          className="text-sm text-gray-500 hover:text-red-500 font-semibold"
        >
          Thoát
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium text-ocean-blue mb-2">
              <span>
                Câu hỏi {currentQuestionIndex + 1} / {test.totalQuestions}
              </span>
              <span>{getProgress()}% hoàn thành</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-blue transition-all duration-500"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Question Header */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-teal-blue/10 text-teal-blue text-xs font-bold uppercase mb-3">
                {currentQuestion.skill}
              </span>
              <h3 className="text-deep-blue text-2xl font-bold">
                Câu {currentQuestionIndex + 1}: {currentQuestion.questionText}
              </h3>
            </div>

            {/* Media Player */}
            {currentQuestion.mediaUrl && (
              <div className="mb-8 bg-background-light rounded-xl p-4">
                <audio
                  controls
                  className="w-full"
                  src={currentQuestion.mediaUrl}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Answer Options */}
            {currentQuestion.questionType === "MULTIPLE_CHOICE" &&
              currentQuestion.options && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => {
                    const optionLabel = String.fromCharCode(65 + index);
                    const isSelected =
                      answers[currentQuestion.id] === optionLabel;

                    return (
                      <label
                        key={index}
                        className={`flex cursor-pointer rounded-xl border-2 p-4 transition-all ${
                          isSelected
                            ? "border-teal-blue bg-teal-blue/5"
                            : "border-gray-200 hover:border-teal-blue"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          checked={isSelected}
                          onChange={() =>
                            handleAnswer(currentQuestion.id, optionLabel)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`flex items-center justify-center size-8 rounded-full border font-bold mr-4 ${
                            isSelected
                              ? "bg-teal-blue text-white"
                              : "border-gray-300 text-gray-500"
                          }`}
                        >
                          {optionLabel}
                        </div>
                        <p className="text-deep-blue font-medium">{option}</p>
                      </label>
                    );
                  })}
                </div>
              )}

            {currentQuestion.questionType === "TRUE_FALSE" && (
              <div className="grid grid-cols-2 gap-4">
                {["true", "false"].map((option) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  const label = option === "true" ? "Đúng" : "Sai";

                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? "border-teal-blue bg-teal-blue/5"
                          : "border-gray-200 hover:border-teal-blue"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        checked={isSelected}
                        onChange={() =>
                          handleAnswer(currentQuestion.id, option)
                        }
                        className="sr-only"
                      />
                      <div className="text-center w-full">
                        <p className="text-deep-blue font-bold text-lg">
                          {label}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {(currentQuestion.questionType === "FILL_BLANK" ||
              currentQuestion.questionType === "REWRITE") && (
              <textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) =>
                  handleAnswer(currentQuestion.id, e.target.value)
                }
                placeholder="Nhập câu trả lời của bạn..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-blue outline-none resize-none"
                rows={currentQuestion.questionType === "REWRITE" ? 4 : 2}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-ocean-blue font-medium hover:bg-gray-100 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Quay lại</span>
            </button>

            <div className="text-sm text-ocean-blue">
              Đã trả lời: {getAnsweredCount()} / {test.totalQuestions}
            </div>

            {currentQuestionIndex < test.totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary hover:bg-orange-600 text-white font-bold"
              >
                <span>Câu tiếp theo</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold disabled:opacity-50"
              >
                <span>{submitting ? "Đang nộp..." : "Nộp bài"}</span>
                <span className="material-symbols-outlined">check_circle</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
