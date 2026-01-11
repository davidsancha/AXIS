export type ScreenType = 'welcome' | 'dashboard' | 'workout' | 'diet' | 'community' | 'profile' | 'admin' | 'meal_registration' | 'library' | 'admin_exercises';

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
  equipment: string;
  video_url?: string;
  image_url?: string;
  met_value: number;
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  time: string;
  image?: string;
  checked?: boolean;
}
