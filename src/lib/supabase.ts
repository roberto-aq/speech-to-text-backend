import { createClient } from '@supabase/supabase-js';
import { envs } from '../config/envs';
import { Database } from '../types/database.types';

export const supabase = createClient<Database>(
	envs.SUPABASE_URL,
	envs.SUPABASE_API_KEY
);
