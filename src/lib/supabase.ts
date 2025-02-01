import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

export const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
		storageKey: 'supabase-auth-token',
		storage: {
			getItem: (key) => {
				if (typeof window === 'undefined') return null;
				return window.localStorage.getItem(key);
			},
			setItem: (key, value) => {
				if (typeof window === 'undefined') return;
				window.localStorage.setItem(key, value);
			},
			removeItem: (key) => {
				if (typeof window === 'undefined') return;
				window.localStorage.removeItem(key);
			}
		}
	}
});
