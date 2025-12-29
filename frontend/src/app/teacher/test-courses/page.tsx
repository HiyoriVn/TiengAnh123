"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";

interface Course {
  id: string;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED";
  level: string;
  price: number;
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    fullName: string;
    email: string;
  };
}

export default function TestCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  // Test 1: Lấy tất cả khóa học của giảng viên
  const testFetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/courses/my-courses");
      setCourses(response.data);

      const result = {
        test: "Fetch My Courses",
        status: "✅ PASS",
        data: response.data,
        count: response.data.length,
        details: response.data.map((c: Course) => ({
          id: c.id,
          title: c.title,
          status: c.status,
          statusType: typeof c.status,
        })),
      };

      setTestResults((prev) => [...prev, result]);
      console.log("✅ Test Fetch My Courses:", result);
    } catch (error: any) {
      const result = {
        test: "Fetch My Courses",
        status: "❌ FAIL",
        error: error.response?.data || error.message,
      };
      setTestResults((prev) => [...prev, result]);
      console.error("❌ Test Fetch My Courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Test 2: Tạo khóa học với status PUBLISHED
  const testCreatePublishedCourse = async () => {
    try {
      setLoading(true);
      const testCourse = {
        title: `TEST PUBLISHED - ${new Date().toISOString()}`,
        description: "This is a test course with PUBLISHED status",
        price: 0,
        level: "ALL",
        status: "PUBLISHED",
      };

      console.log("📤 Sending course data:", testCourse);
      const response = await api.post("/courses", testCourse);
      console.log("📥 Received response:", response.data);

      const result = {
        test: "Create PUBLISHED Course",
        status: "✅ PASS",
        sentData: testCourse,
        receivedData: response.data,
        statusMatch: response.data.status === "PUBLISHED",
      };

      setTestResults((prev) => [...prev, result]);

      // Fetch lại danh sách để verify
      await testFetchCourses();
    } catch (error: any) {
      const result = {
        test: "Create PUBLISHED Course",
        status: "❌ FAIL",
        error: error.response?.data || error.message,
      };
      setTestResults((prev) => [...prev, result]);
      console.error("❌ Test Create PUBLISHED Course:", error);
    } finally {
      setLoading(false);
    }
  };

  // Test 3: Tạo khóa học với status DRAFT
  const testCreateDraftCourse = async () => {
    try {
      setLoading(true);
      const testCourse = {
        title: `TEST DRAFT - ${new Date().toISOString()}`,
        description: "This is a test course with DRAFT status",
        price: 0,
        level: "A1",
        status: "DRAFT",
      };

      console.log("📤 Sending course data:", testCourse);
      const response = await api.post("/courses", testCourse);
      console.log("📥 Received response:", response.data);

      const result = {
        test: "Create DRAFT Course",
        status: "✅ PASS",
        sentData: testCourse,
        receivedData: response.data,
        statusMatch: response.data.status === "DRAFT",
      };

      setTestResults((prev) => [...prev, result]);

      // Fetch lại danh sách để verify
      await testFetchCourses();
    } catch (error: any) {
      const result = {
        test: "Create DRAFT Course",
        status: "❌ FAIL",
        error: error.response?.data || error.message,
      };
      setTestResults((prev) => [...prev, result]);
      console.error("❌ Test Create DRAFT Course:", error);
    } finally {
      setLoading(false);
    }
  };

  // Test 4: Cập nhật khóa học từ DRAFT → PUBLISHED
  const testUpdateCourseStatus = async (courseId: string) => {
    try {
      setLoading(true);
      const updateData = {
        status: "PUBLISHED",
      };

      console.log(`📤 Updating course ${courseId}:`, updateData);
      const response = await api.patch(`/courses/${courseId}`, updateData);
      console.log("📥 Update response:", response.data);

      const result = {
        test: "Update Course Status",
        status: "✅ PASS",
        courseId,
        sentData: updateData,
        receivedData: response.data,
        statusMatch: response.data.status === "PUBLISHED",
      };

      setTestResults((prev) => [...prev, result]);

      // Fetch lại danh sách để verify
      await testFetchCourses();
    } catch (error: any) {
      const result = {
        test: "Update Course Status",
        status: "❌ FAIL",
        courseId,
        error: error.response?.data || error.message,
      };
      setTestResults((prev) => [...prev, result]);
      console.error("❌ Test Update Course Status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Test 5: Kiểm tra chi tiết một khóa học
  const testGetCourseDetail = async (courseId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/${courseId}`);

      const result = {
        test: "Get Course Detail",
        status: "✅ PASS",
        courseId,
        data: response.data,
        statusValue: response.data.status,
        statusType: typeof response.data.status,
      };

      setTestResults((prev) => [...prev, result]);
      console.log("✅ Test Get Course Detail:", result);
    } catch (error: any) {
      const result = {
        test: "Get Course Detail",
        status: "❌ FAIL",
        courseId,
        error: error.response?.data || error.message,
      };
      setTestResults((prev) => [...prev, result]);
      console.error("❌ Test Get Course Detail:", error);
    } finally {
      setLoading(false);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setTestResults([]);
    console.log("🚀 Starting all tests...");

    // Test 1: Fetch courses
    await testFetchCourses();

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 2: Create PUBLISHED course
    await testCreatePublishedCourse();

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 3: Create DRAFT course
    await testCreateDraftCourse();

    console.log("✅ All tests completed!");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 Test Courses Debug</h1>

      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            {loading ? "Running..." : "🚀 Run All Tests"}
          </button>

          <button
            onClick={testFetchCourses}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            1️⃣ Fetch Courses
          </button>

          <button
            onClick={testCreatePublishedCourse}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            2️⃣ Create PUBLISHED
          </button>

          <button
            onClick={testCreateDraftCourse}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-gray-400"
          >
            3️⃣ Create DRAFT
          </button>

          <button
            onClick={() => setTestResults([])}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            🗑️ Clear Results
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-4">
            {testResults.map((result, idx) => (
              <div
                key={idx}
                className={`p-4 rounded border-l-4 ${
                  result.status.includes("✅")
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                }`}
              >
                <div className="font-semibold text-lg mb-2">
                  {result.status} {result.test}
                </div>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Current Courses ({courses.length})
        </h2>

        {courses.length === 0 ? (
          <p className="text-gray-500">
            No courses found. Run tests to create some.
          </p>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="border rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-gray-600">
                      {course.description}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      course.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <div>ID: {course.id}</div>
                  <div>Level: {course.level}</div>
                  <div>Price: {course.price}đ</div>
                  <div>
                    Created: {new Date(course.createdAt).toLocaleString()}
                  </div>
                  <div>Status Type: {typeof course.status}</div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => testGetCourseDetail(course.id)}
                    className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Check Detail
                  </button>

                  {course.status === "DRAFT" && (
                    <button
                      onClick={() => testUpdateCourseStatus(course.id)}
                      className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Update to PUBLISHED
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Console Output Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Mở Developer Console (F12) để xem chi tiết
          logs của các API calls.
        </p>
      </div>
    </div>
  );
}
