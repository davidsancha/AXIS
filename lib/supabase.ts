import { createClient } from '@supabase/supabase-js';
import { Database } from '../supabase_types'; // We'll create this or use the generated ones

const supabaseUrl = 'https://rpqealcusyoqovvzrahk.supabase.co';
const supabaseAnonKey = 'sb_publishable_0iTu8N1_Hdm595vZwQ78QA_xJ0i9uvB';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
