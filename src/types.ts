export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  duration: string;
  videoUrl: string; // Embeddable YouTube/Vimeo or local mockup
  imageUrl: string;
  notes: string;
  orderIndex: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  difficulty: string;
  duration: string;
  rating: number;
  enrollmentsCount: number;
  coverImage: string;
  author: string;
  features: string[];
  lessons: Lesson[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  enrolledCourseId: number | null;
  registeredCourseIds?: number[]; // list of course IDs selected during registration
  completedLessons: number[]; // array of lesson IDs
}
