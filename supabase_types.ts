export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    avatar_url: string | null
                    first_name: string | null
                    id: string
                    is_admin: boolean | null
                    last_name: string | null
                    plan: string | null
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    first_name?: string | null
                    id: string
                    is_admin?: boolean | null
                    last_name?: string | null
                    plan?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    first_name?: string | null
                    id?: string
                    is_admin?: boolean | null
                    last_name?: string | null
                    plan?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
            }
            exercises: {
                Row: {
                    created_at: string | null
                    description: string | null
                    equipment: string | null
                    id: string
                    image_url: string | null
                    muscle_group: string | null
                    name: string
                    video_url: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    equipment?: string | null
                    id?: string
                    image_url?: string | null
                    muscle_group?: string | null
                    name: string
                    video_url?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    equipment?: string | null
                    id?: string
                    image_url?: string | null
                    muscle_group?: string | null
                    name?: string
                    video_url?: string | null
                }
            }
            workout_plans: {
                Row: {
                    created_at: string | null
                    created_by: string | null
                    description: string | null
                    difficulty: string | null
                    duration_weeks: number | null
                    id: string
                    is_public: boolean | null
                    thumbnail_url: string | null
                    title: string
                }
                Insert: {
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    difficulty?: string | null
                    duration_weeks?: number | null
                    id?: string
                    is_public?: boolean | null
                    thumbnail_url?: string | null
                    title: string
                }
                Update: {
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    difficulty?: string | null
                    duration_weeks?: number | null
                    id?: string
                    is_public?: boolean | null
                    thumbnail_url?: string | null
                    title?: string
                }
            }
            posts: {
                Row: {
                    category: string | null
                    content: string
                    created_at: string | null
                    id: string
                    image_url: string | null
                    is_pinned: boolean | null
                    title: string | null
                    user_id: string
                }
                Insert: {
                    category?: string | null
                    content: string
                    created_at?: string | null
                    id?: string
                    image_url?: string | null
                    is_pinned?: boolean | null
                    title?: string | null
                    user_id: string
                }
                Update: {
                    category?: string | null
                    content?: string
                    created_at?: string | null
                    id?: string
                    image_url?: string | null
                    is_pinned?: boolean | null
                    title?: string | null
                    user_id?: string
                }
            }
            // Add more tables as needed and fully integrated later
        }
    }
}
