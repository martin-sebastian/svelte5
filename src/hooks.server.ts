import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	// Get session from cookie
	const {
		data: { session }
	} = await event.locals.supabase.auth.getSession();

	// Get user if session exists
	const {
		data: { user },
		error: userError
	} = session ? await event.locals.supabase.auth.getUser() : { data: { user: null }, error: null };

	// Set user in locals
	event.locals.user = user;

	// Handle auth protection for admin routes
	if (event.url.pathname.startsWith('/admin')) {
		if (!session || userError || !user) {
			throw redirect(303, `/auth?redirectTo=${event.url.pathname}`);
		}
	}

	// For /auth routes, redirect to admin if user is already authenticated
	// But skip this check if we're handling a form action
	if (event.url.pathname === '/auth' && event.request.method !== 'POST') {
		if (session && user && !userError) {
			const redirectTo = event.url.searchParams.get('redirectTo') || '/admin';
			throw redirect(303, redirectTo);
		}
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});

	return response;
};
