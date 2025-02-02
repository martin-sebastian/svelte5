import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '../types/supabase';

export const createSupabaseServerClient = ({ cookies }: { cookies: any }) => {
	return createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => cookies.get(key),
			set: (key, value, options) => {
				cookies.set(key, value, {
					...options,
					path: '/',
					sameSite: 'lax',
					secure: process.env.NODE_ENV === 'production'
				});
			},
			remove: (key, options) => {
				cookies.delete(key, {
					...options,
					path: '/'
				});
			}
		}
	});
};
