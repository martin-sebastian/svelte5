import { createSupabaseServerClient } from '$lib/server/supabase';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Initialize Supabase client
	event.locals.supabase = createSupabaseServerClient({ cookies: event.cookies });

	// Use getUser instead of getSession for secure verification
	event.locals.getUser = async () => {
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error || !user) {
			return null;
		}
		return user;
	};

	// Only check auth for admin routes and exclude API routes
	if (event.url.pathname.startsWith('/admin') && !event.url.pathname.startsWith('/admin/api')) {
		const user = await event.locals.getUser();
		if (!user) {
			throw redirect(303, '/');
		}
	}

	// Add cache headers for vehicle data
	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});

	// Add cache headers for vehicle routes
	if (event.url.pathname.startsWith('/admin/vehicles')) {
		response.headers.set('Cache-Control', 'public, max-age=10');
	}

	return response;
};
