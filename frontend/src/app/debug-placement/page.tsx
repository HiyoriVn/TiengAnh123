"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function DebugPlacementPage() {
  const [activeTest, setActiveTest] = useState<any>(null);
  const [eligibility, setEligibility] = useState<any>(null);
  const [allTests, setAllTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const checkActiveTest = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/placement-test/active");
      setActiveTest(response.data);
      console.log("✅ Active test:", response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      console.error("❌ Active test error:", err);
      setActiveTest(null);
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/placement-test/check-eligibility");
      setEligibility(response.data);
      console.log("✅ Eligibility:", response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      console.error("❌ Eligibility error:", err);
      setEligibility(null);
    } finally {
      setLoading(false);
    }
  };

  const getAllTests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/placement-test/all");
      setAllTests(response.data);
      console.log("✅ All tests:", response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      console.error("❌ All tests error:", err);
      setAllTests([]);
    } finally {
      setLoading(false);
    }
  };

  const testSubmit = async () => {
    if (!activeTest) {
      alert("Chưa có test active!");
      return;
    }

    const mockAnswers: Record<string, string> = {};
    activeTest.questions?.forEach((q: any, idx: number) => {
      mockAnswers[q.id] = idx % 2 === 0 ? q.correctAnswer : "wrong_answer";
    });

    const payload = {
      testId: activeTest.id,
      answers: mockAnswers,
      timeTaken: 300,
    };

    console.log("📤 Submitting payload:", payload);
    console.log("📊 Payload details:", {
      testId: payload.testId,
      answerCount: Object.keys(payload.answers).length,
      answerKeys: Object.keys(payload.answers),
      timeTaken: payload.timeTaken,
    });

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/placement-test/submit", payload);
      console.log("✅ Submit success:", response.data);
      alert("Nộp bài thành công! Xem console.");
    } catch (err: any) {
      console.error("❌ Full error object:", err);
      console.error("❌ Error response:", err.response);
      console.error("❌ Error response data:", err.response?.data);
      console.error("❌ Error stack:", err.stack);

      const errorDetails = {
        message: err.response?.data?.message || err.message,
        statusCode: err.response?.status,
        error: err.response?.data?.error,
        fullData: err.response?.data,
      };

      const errorMsg = JSON.stringify(errorDetails, null, 2);
      setError(errorMsg);
      console.error("❌ Formatted error:", errorDetails);
      alert(`Lỗi submit:\n${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Debug Placement Test</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold">❌ Error:</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={checkActiveTest}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            1️⃣ Check Active Test
          </button>
          <button
            onClick={checkEligibility}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            2️⃣ Check Eligibility
          </button>
          <button
            onClick={getAllTests}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            3️⃣ Get All Tests (Admin)
          </button>
          <button
            onClick={testSubmit}
            disabled={loading || !activeTest}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400"
          >
            🚀 Test Submit (Mock Data)
          </button>
        </div>
      </div>

      {/* Active Test */}
      {activeTest && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-600">
            ✅ Active Test Found
          </h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>ID:</strong> {activeTest.id}
            </div>
            <div>
              <strong>Title:</strong> {activeTest.title}
            </div>
            <div>
              <strong>Status:</strong> {activeTest.status}
            </div>
            <div>
              <strong>Duration:</strong> {activeTest.duration} minutes
            </div>
            <div>
              <strong>Total Questions:</strong> {activeTest.totalQuestions}
            </div>
            <div>
              <strong>Actual Questions:</strong>{" "}
              {activeTest.questions?.length || 0}
            </div>
          </div>
          {activeTest.questions && activeTest.questions.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">
                View Questions ({activeTest.questions.length})
              </summary>
              <pre className="bg-gray-50 p-4 rounded mt-2 overflow-auto text-xs">
                {JSON.stringify(
                  activeTest.questions.map((q: any) => ({
                    id: q.id,
                    text: q.questionText,
                    type: q.questionType,
                    skill: q.skill,
                    order: q.order,
                  })),
                  null,
                  2
                )}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Eligibility */}
      {eligibility && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2
            className={`text-xl font-semibold mb-4 ${
              eligibility.canTake ? "text-green-600" : "text-red-600"
            }`}
          >
            {eligibility.canTake ? "✅" : "❌"} Eligibility Check
          </h2>
          <pre className="bg-gray-50 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(eligibility, null, 2)}
          </pre>
        </div>
      )}

      {/* All Tests */}
      {allTests.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            📋 All Tests ({allTests.length})
          </h2>
          <div className="space-y-4">
            {allTests.map((test) => (
              <div key={test.id} className="border rounded p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{test.title}</div>
                    <div className="text-sm text-gray-600">ID: {test.id}</div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      test.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : test.status === "DRAFT"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {test.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {test.totalQuestions} questions • {test.duration} minutes
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold mb-2">💡 Debug Steps:</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>
            Click "Check Active Test" - Should return a test with ACTIVE status
          </li>
          <li>If no active test, login as lecturer and activate one</li>
          <li>Click "Check Eligibility" - Should return {`{canTake: true}`}</li>
          <li>
            Click "Test Submit" - Should successfully submit with mock answers
          </li>
          <li>Check browser console (F12) for detailed logs</li>
        </ol>
      </div>
    </div>
  );
}
