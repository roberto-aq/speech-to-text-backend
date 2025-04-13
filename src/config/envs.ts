import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
	PORT: get('PORT').required().asPortNumber(),
	ASSEMBLYAI_API_KEY: get('ASSEMBLYAI_API_KEY').required().asString(),
	ENCRYPTION_SECRET: get('ENCRYPTION_SECRET').required().asString(),
	SUPABASE_URL: get('SUPABASE_URL').required().asString(),
	SUPABASE_API_KEY: get('SUPABASE_API_KEY').required().asString(),
};
