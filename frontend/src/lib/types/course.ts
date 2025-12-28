/**
 * Course, Lesson & Enrollment Types
 */

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CourseCreator {
  id: string;
  fullName: string;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  coverUrl?: string;
  creator: CourseCreator;
  level?: CourseLevel;
  duration?: string;
  lessonsCount?: number;
  enrollmentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  duration?: string;
  order: number;
  videoUrl?: string;
  courseId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseDetail extends Course {
  lessons: Lesson[];
  totalDuration: string;
  isEnrolled?: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  enrolledAt: string;
  lastAccessedAt?: string;
  course?: Course;
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  lessonId?: string;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  answers: Answer[];
  correctAnswerId?: string;
}

export interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Submission {
  id: string;
  userId: string;
  assessmentId: string;
  answers: Record<string, string>;
  score: number;
  submittedAt: string;
}
