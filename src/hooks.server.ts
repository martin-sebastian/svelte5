import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, {
					...options,
					path: '/',
					sameSite: 'lax',
					secure: process.env.NODE_ENV === 'production'
				});
			},
			remove: (key, options) => {
				event.cookies.delete(key, {
					...options,
					path: '/'
				});
			}
		}
	});

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) return null;

		// Verify the user is valid
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error || !user) return null;

		return session;
	};

	return resolve(event);
};
