import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, options);
			},
			remove: (key, options) => {
				event.cookies.delete(key, options);
			}
		}
	});

	// First get the session
	const {
		data: { session }
	} = await event.locals.supabase.auth.getSession();

	// Then get the user securely
	const {
		data: { user }
	} = await event.locals.supabase.auth.getUser();

	// Set both session and user in locals
	event.locals.session = session;
	event.locals.user = user;

	// Update getSession to return the verified session
	event.locals.getSession = async () => {
		const {
			data: { user: verifiedUser }
		} = await event.locals.supabase.auth.getUser();
		return verifiedUser ? session : null;
	};

	// Handle auth protection for admin routes
	if (event.url.pathname.startsWith('/admin')) {
		if (!session) {
			// Simplified condition
			throw redirect(303, `/auth?redirectTo=${event.url.pathname}`);
		}
	}

	// For /auth routes, redirect to admin if user is already authenticated
	if (event.url.pathname === '/auth' && event.request.method === 'GET') {
		if (session) {
			// Simplified condition
			const redirectTo = event.url.searchParams.get('redirectTo') || '/admin';
			throw redirect(303, redirectTo);
		}
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});

	response.headers.set('Cache-Control', 'no-store'); // Essential to prevent caching issues.

	return response;
};
