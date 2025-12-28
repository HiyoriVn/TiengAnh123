"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import {
  CheckCircle,
  BookOpen,
  Award,
  Share2,
  Bookmark,
  FileText,
} from "lucide-react";

interface Document {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  type: "PRACTICE" | "QUIZ" | "HOMEWORK";
  timeLimit: number | null;
  passingScore: number;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  audioUrl: string | null;
  pdfUrl: string | null;
  orderIndex: number;
  documents: Document[];
}

interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function LessonDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"theory" | "vocabulary" | "notes">(
    "theory"
  );
  const [progress] = useState(40);
  const [xpGained] = useState(50);
  const [accuracy] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/lessons/${id}`);
        setLesson(res.data);

        // Fetch course info to get navigation
        if (res.data.course) {
          const courseRes = await api.get(`/courses/${res.data.course.id}`);
          setCourse(courseRes.data);
        }

        // Fetch exercises for this lesson
        try {
          const exercisesRes = await api.get(`/exercises/lesson/${id}`);
          setExercises(exercisesRes.data);
        } catch (err) {
          console.error("Failed to fetch exercises:", err);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLesson();
  }, [id]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      videoRef.current.currentTime = percentage * duration;
    }
  };

  const getCurrentLessonIndex = () => {
    if (!course || !lesson) return -1;
    return course.lessons.findIndex((l) => l.id === lesson.id);
  };

  const getNextLesson = () => {
    if (!course) return null;
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex >= 0 && currentIndex < course.lessons.length - 1) {
      return course.lessons[currentIndex + 1];
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!course) return null;
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex > 0) {
      return course.lessons[currentIndex - 1];
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Đang tải bài học...
          </p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">
            Không tìm thấy bài học
          </p>
          <button
            onClick={() => router.back()}
            className="text-primary hover:underline"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-slate-500 dark:text-slate-400">
          <button
            onClick={() => router.push("/student/dashboard")}
            className="hover:text-primary transition-colors"
          >
            Trang chủ
          </button>
          <span className="mx-2">/</span>
          {course && (
            <>
              <button
                onClick={() => router.push(`/student/courses`)}
                className="hover:text-primary transition-colors"
              >
                {course.title}
              </button>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-brand-dark dark:text-white font-medium">
            {lesson.title}
          </span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-brand-dark dark:text-white">
              {lesson.title}
            </h1>
            <p className="text-brand-medium dark:text-brand-light">
              Bài {lesson.orderIndex} • {course?.title || "Đang tải..."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-brand-medium border border-slate-200 dark:border-brand-dark hover:bg-slate-50 dark:hover:bg-brand-dark rounded-lg text-sm font-bold text-brand-dark dark:text-brand-light transition-colors">
              <Bookmark size={20} />
              Lưu
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-sm font-bold text-primary transition-colors">
              <Share2 size={20} />
              Chia sẻ
            </button>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-slate-200 dark:border-brand-medium shadow-sm flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-brand-medium dark:text-brand-light">
                Tiến độ bài học
              </span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 dark:bg-brand-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex gap-6 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <Award className="text-amber-500" size={20} />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  XP Đạt được
                </p>
                <p className="text-sm font-bold text-brand-dark dark:text-white">
                  +{xpGained} XP
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Độ chính xác
                </p>
                <p className="text-sm font-bold text-brand-dark dark:text-white">
                  {accuracy}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg group">
              {lesson.videoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={lesson.videoUrl}
                    className="w-full h-full"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleTimeUpdate}
                    onClick={handlePlayPause}
                  />
                  {!isPlaying && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                      onClick={handlePlayPause}
                    >
                      <div className="size-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/50">
                        <span className="material-symbols-outlined text-white text-[40px] ml-1">
                          play_arrow
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div
                      className="h-1 bg-white/30 rounded-full mb-4 cursor-pointer"
                      onClick={handleProgressBarClick}
                    >
                      <div
                        className="h-full bg-primary rounded-full relative"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full shadow"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <div className="flex items-center gap-4">
                        <button onClick={handlePlayPause}>
                          <span className="material-symbols-outlined">
                            {isPlaying ? "pause" : "play_arrow"}
                          </span>
                        </button>
                        <span className="text-xs font-medium">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="text-xs font-bold bg-white/20 px-2 py-1 rounded hover:bg-white/30">
                          1x
                        </button>
                        <button>
                          <span className="material-symbols-outlined">
                            fullscreen
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Bài học này chưa có video</p>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Player */}
            {lesson.audioUrl && (
              <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-brand-medium rounded-xl shadow-sm p-6">
                <h3 className="text-base font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    volume_up
                  </span>
                  Audio bài giảng
                </h3>
                <audio controls className="w-full">
                  <source src={lesson.audioUrl} type="audio/mpeg" />
                  Trình duyệt của bạn không hỗ trợ phát audio.
                </audio>
              </div>
            )}

            {/* PDF Viewer */}
            {lesson.pdfUrl && (
              <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-brand-medium rounded-xl shadow-sm p-6">
                <h3 className="text-base font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="text-primary" size={20} />
                  Tài liệu PDF
                </h3>
                <a
                  href={lesson.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary font-semibold transition-colors"
                >
                  <FileText size={20} />
                  Mở tài liệu PDF
                </a>
              </div>
            )}

            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-brand-dark dark:text-white">
                  {lesson.title}
                </h3>
                <p className="text-brand-medium dark:text-brand-light text-sm mt-1">
                  {course?.title || "Loading..."}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar with Tabs */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-brand-medium rounded-xl shadow-sm flex flex-col h-[500px] lg:h-full lg:max-h-[600px] sticky top-24">
              <div className="flex border-b border-slate-200 dark:border-brand-medium">
                <button
                  className={`flex-1 py-3 text-sm font-bold ${
                    activeTab === "theory"
                      ? "text-primary border-b-2 border-primary"
                      : "text-slate-500 dark:text-slate-400 hover:text-brand-dark dark:hover:text-white"
                  }`}
                  onClick={() => setActiveTab("theory")}
                >
                  Lý thuyết
                </button>
                <button
                  className={`flex-1 py-3 text-sm font-bold ${
                    activeTab === "vocabulary"
                      ? "text-primary border-b-2 border-primary"
                      : "text-slate-500 dark:text-slate-400 hover:text-brand-dark dark:hover:text-white"
                  }`}
                  onClick={() => setActiveTab("vocabulary")}
                >
                  Từ vựng
                </button>
                <button
                  className={`flex-1 py-3 text-sm font-bold ${
                    activeTab === "notes"
                      ? "text-primary border-b-2 border-primary"
                      : "text-slate-500 dark:text-slate-400 hover:text-brand-dark dark:hover:text-white"
                  }`}
                  onClick={() => setActiveTab("notes")}
                >
                  Ghi chú
                </button>
              </div>

              <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                {activeTab === "theory" && (
                  <div>
                    <h4 className="text-base font-bold text-brand-dark dark:text-white mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        lightbulb
                      </span>
                      Nội dung bài học
                    </h4>
                    <div className="prose dark:prose-invert max-w-none">
                      <div
                        className="text-sm text-brand-medium dark:text-brand-light leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: lesson.content }}
                      />
                    </div>

                    {/* Documents */}
                    {lesson.documents && lesson.documents.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-brand-medium">
                        <h4 className="text-sm font-bold text-brand-dark dark:text-white mb-3">
                          Tài liệu đính kèm
                        </h4>
                        <div className="space-y-2">
                          {lesson.documents.map((doc) => (
                            <a
                              key={doc.id}
                              href={doc.filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-brand-dark/50 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-dark transition-colors"
                            >
                              <div className="p-2 bg-primary/10 rounded text-primary">
                                <BookOpen size={18} />
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <p className="font-medium text-sm truncate text-brand-dark dark:text-white">
                                  {doc.fileName}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                                  {doc.fileType}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "vocabulary" && (
                  <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                    <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Từ vựng đang được cập nhật</p>
                  </div>
                )}

                {activeTab === "notes" && (
                  <div>
                    <textarea
                      className="w-full h-40 p-3 bg-slate-50 dark:bg-brand-dark/50 border border-slate-200 dark:border-brand-medium rounded-lg text-sm text-brand-dark dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Viết ghi chú của bạn tại đây..."
                    ></textarea>
                    <button className="mt-3 w-full py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors">
                      Lưu ghi chú
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Practice Exercises Section */}
        {exercises.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <span className="material-symbols-outlined text-primary text-[28px]">
                  assignment
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-brand-dark dark:text-white">
                  Bài tập thực hành
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Hoàn thành các bài tập để củng cố kiến thức
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-white dark:bg-card-dark border border-slate-200 dark:border-brand-medium rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() =>
                    router.push(`/student/exercises/${exercise.id}`)
                  }
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          exercise.type === "PRACTICE"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30"
                            : exercise.type === "QUIZ"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-900/30"
                        }`}
                      >
                        {exercise.type === "PRACTICE"
                          ? "📝 Luyện tập"
                          : exercise.type === "QUIZ"
                          ? "🎯 Kiểm tra"
                          : "📚 Bài tập"}
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                      arrow_forward
                    </span>
                  </div>

                  <h3 className="font-bold text-brand-dark dark:text-white mb-2 line-clamp-2">
                    {exercise.title}
                  </h3>

                  {exercise.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {exercise.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    {exercise.timeLimit && (
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          timer
                        </span>
                        {exercise.timeLimit} phút
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        check_circle
                      </span>
                      Đạt {exercise.passingScore}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 pb-12 border-t border-slate-200 dark:border-brand-medium">
          {getPreviousLesson() ? (
            <button
              onClick={() =>
                router.push(`/student/lessons/${getPreviousLesson()?.id}`)
              }
              className="flex items-center gap-2 text-slate-600 hover:text-brand-dark dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Bài trước
            </button>
          ) : (
            <div></div>
          )}

          {getNextLesson() ? (
            <button
              onClick={() =>
                router.push(`/student/lessons/${getNextLesson()?.id}`)
              }
              className="flex items-center gap-2 bg-brand-dark dark:bg-white text-white dark:text-brand-dark hover:opacity-90 font-bold py-3 px-8 rounded-xl shadow-lg transition-all"
            >
              Bài tiếp theo
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={() => router.push("/student/courses")}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all"
            >
              Hoàn thành khóa học
              <CheckCircle size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
