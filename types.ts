export type ScreenType = 'welcome' | 'dashboard' | 'profile' | 'messages' | 'library' | 'admin_exercises' | 'workout_list' | 'workout_editor' | 'workout_creator' | 'admin' | 'meal_registration' | 'diet' | 'community';

export interface User {
  name: string;
  avatar: string;
  plan: string;
  status: 'active' | 'pending' | 'suspended';
}

export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  target_muscle?: string;
  secondary_muscles?: string;
  equipment: string;
  video_url?: string;
  image_url?: string;
  met_value?: number;
}

export interface SetConfig {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  sort_order: number;
  sets: SetConfig[];
  exercise?: Exercise; // Joined
}

export interface Workout {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  scheduled_days: number[]; // 0-6
  exercises?: WorkoutExercise[];
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  time: string;
  image?: string;
  checked?: boolean;
}
