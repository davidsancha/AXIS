export type ScreenType = 'welcome' | 'dashboard' | 'workout' | 'diet' | 'community' | 'profile' | 'admin';

export interface User {
  name: string;
  avatar: string;
  plan: string;
  status: 'active' | 'pending' | 'suspended';
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  time: string;
  image?: string;
  checked?: boolean;
}
