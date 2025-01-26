import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { CookieSerializeOptions } from 'cookie';
import type { RequestEvent } from '@sveltejs/kit';

export function createSupabaseServerClient(event: RequestEvent) {
	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => {
				const cookie = event.cookies.get(key);
				return cookie ?? undefined; // Convert null to undefined
			},
			set: (key, value, options: CookieSerializeOptions) => {
				if (!value || value === '') {
					event.cookies.delete(key, { path: '/' });
					return;
				}
				event.cookies.set(key, value, {
					...options,
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax'
				});
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});
}
