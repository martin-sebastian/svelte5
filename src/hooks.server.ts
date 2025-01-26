import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				if (!event.cookies.getAll().some((cookie) => cookie.name === key)) {
					event.cookies.set(key, value, {
						...options,
						path: '/',
						sameSite: 'lax',
						secure: process.env.NODE_ENV === 'production'
					});
				}
			},
			remove: (key, options) => {
				event.cookies.delete(key, {
					...options,
					path: '/'
				});
			}
		}
	});

	const response = await resolve(event, {
		filterSerializeResponse(response) {
			return response.status === 200;
		}
	});

	return response;
};
