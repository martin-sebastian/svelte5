import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from './types/supabase';

export const supabase = createBrowserClient<Database>(
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
	{
		cookies: {
			get(key) {
				if (typeof document === 'undefined') return '';
				return document.cookie
					.split('; ')
					.find((row) => row.startsWith(`${key}=`))
					?.split('=')[1];
			},
			set(key, value, options) {
				if (typeof document === 'undefined') return;
				document.cookie = `${key}=${value}; Max-Age=${options.maxAge}; Path=${options.path}; SameSite=${options.sameSite}`;
			},
			remove(key, options) {
				if (typeof document === 'undefined') return;
				document.cookie = `${key}=; Max-Age=0; Path=${options.path}`;
			}
		}
	}
);
