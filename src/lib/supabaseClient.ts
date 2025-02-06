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
				const cookie = document.cookie.split('; ').find((row) => row.startsWith(`${key}=`));
				return cookie ? cookie.split('=')[1] : '';
			},
			set(key, value, options) {
				if (typeof document === 'undefined') return;
				let cookie = `${key}=${value}`;
				if (options.maxAge) {
					cookie += `; Max-Age=${options.maxAge}`;
				}
				if (options.path) {
					cookie += `; Path=${options.path}`;
				}
				cookie += '; SameSite=Lax; Secure';
				document.cookie = cookie;
			},
			remove(key, options) {
				if (typeof document === 'undefined') return;
				document.cookie = `${key}=; Max-Age=0; Path=${options?.path || '/'}`;
			}
		},
		auth: {
			flowType: 'pkce',
			detectSessionInUrl: true,
			persistSession: true,
			autoRefreshToken: true
		}
	}
);
