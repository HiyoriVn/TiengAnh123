"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/utils/api";

interface ExerciseQuestion {
  id: string;
  question: string;
  type:
    | "MULTIPLE_CHOICE"
    | "TRUE_FALSE"
    | "FILL_BLANK"
    | "MATCHING"
    | "SHORT_ANSWER";
  options?: string[];
  explanation?: string;
  points: number;
  orderIndex: number;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  type: "PRACTICE" | "QUIZ" | "HOMEWORK";
  timeLimit: number | null;
  passingScore: number;
  questions: ExerciseQuestion[];
}

interface ExerciseResult {
  id: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeSpent: number;
  passed: boolean;
  answers: Record<string, string>;
  createdAt: string;
}

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id as string;

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startTime] = useState<number>(Date.now());

  // Load exercise
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await api.get(`/exercises/${exerciseId}`);
        setExercise(response.data);

        // Kiểm tra xem user đã làm chưa
        try {
          const resultResponse = await api.get(
            `/exercises/${exerciseId}/result`
          );
          if (resultResponse.data) {
            setResult(resultResponse.data);
          }
        } catch {
          // Chưa làm, không có result
        }

        // Setup timer nếu có giới hạn thời gian
        if (response.data.timeLimit) {
          setTimeLeft(response.data.timeLimit * 60); // Convert to seconds
        }
      } catch (error) {
        console.error("Failed to load exercise:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || result) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          // Time's up - auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, result]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!exercise) return;

    setSubmitting(true);
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const response = await api.post(
        `/exercises/${exerciseId}/submit`,
        {
          answers,
        },
        {
          params: { timeSpent },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error("Failed to submit exercise:", error);
      alert("Nộp bài thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderQuestion = (question: ExerciseQuestion) => {
    const userAnswer = result
      ? result.answers[question.id]
      : answers[question.id];
    const isCorrect = result && result.answers[question.id] !== undefined;

    switch (question.type) {
      case "MULTIPLE_CHOICE":
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  result
                    ? userAnswer === option
                      ? isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-gray-200"
                    : userAnswer === option
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  disabled={!!result}
                  className="mr-3"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "TRUE_FALSE":
        return (
          <div className="space-y-2">
            {["true", "false"].map((value) => (
              <label
                key={value}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  result
                    ? userAnswer === value
                      ? isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-gray-200"
                    : userAnswer === value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={value}
                  checked={userAnswer === value}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  disabled={!!result}
                  className="mr-3"
                />
                <span>{value === "true" ? "Đúng" : "Sai"}</span>
              </label>
            ))}
          </div>
        );

      case "FILL_BLANK":
      case "SHORT_ANSWER":
        return (
          <input
            type="text"
            value={userAnswer || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            disabled={!!result}
            placeholder="Nhập câu trả lời..."
            className={`w-full px-4 py-2 border rounded-lg ${
              result
                ? isCorrect
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
                : "border-gray-300 focus:border-blue-500 focus:outline-none"
            }`}
          />
        );

      case "MATCHING":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Nhập các cặp theo định dạng JSON: {`{"1": "A", "2": "B"}`}
            </p>
            <textarea
              value={userAnswer || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={!!result}
              placeholder='{"1": "A", "2": "B"}'
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg ${
                result
                  ? isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : "border-gray-300 focus:border-blue-500 focus:outline-none"
              }`}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài tập...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy bài tập</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:underline"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{exercise.title}</h1>
          {timeLeft !== null && !result && (
            <div
              className={`text-lg font-semibold px-4 py-2 rounded-lg ${
                timeLeft < 60
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              ⏱️ {formatTime(timeLeft)}
            </div>
          )}
        </div>
        {exercise.description && (
          <p className="text-gray-600">{exercise.description}</p>
        )}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            {exercise.type}
          </span>
          <span>📝 {exercise.questions.length} câu hỏi</span>
          {exercise.timeLimit && <span>⏱️ {exercise.timeLimit} phút</span>}
          <span>🎯 Điểm đạt: {exercise.passingScore}%</span>
        </div>
      </div>

      {/* Result Summary */}
      {result && (
        <div
          className={`mb-6 p-6 rounded-lg ${
            result.passed
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {result.passed ? "🎉 Chúc mừng! Bạn đã đạt" : "😔 Chưa đạt"}
            </h2>
            <div className="text-3xl font-bold">{result.score.toFixed(1)}%</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {result.correctCount}
              </div>
              <div className="text-sm text-gray-600">Câu đúng</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {result.totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Tổng câu</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(result.timeSpent)}
              </div>
              <div className="text-sm text-gray-600">Thời gian</div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={() => {
                setResult(null);
                setAnswers({});
                if (exercise.timeLimit) {
                  setTimeLeft(exercise.timeLimit * 60);
                }
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Làm lại
            </button>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {exercise.questions
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((question, index) => (
            <div
              key={question.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    {question.question}
                  </p>
                  <span className="text-sm text-gray-500">
                    {question.points} điểm
                  </span>
                </div>
              </div>

              {renderQuestion(question)}

              {/* Show explanation after submit */}
              {result && question.explanation && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    💡 Giải thích:
                  </p>
                  <p className="text-sm text-gray-600">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Submit Button */}
      {!result && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length === 0}
            className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Đang nộp bài..." : "Nộp bài"}
          </button>
        </div>
      )}
    </div>
  );
}
