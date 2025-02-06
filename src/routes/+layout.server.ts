import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Public routes that don't need session checks
	const isPublicRoute = url.pathname === '/' || url.pathname.startsWith('/auth');

	let session = null;
	let user = null;

	try {
		// Always get the session first
		session = await locals.getSession();

		// If we have a session, always get the verified user data
		if (session) {
			const {
				data: { user: userData },
				error: userError
			} = await locals.supabase.auth.getUser();
			if (userError) throw userError;
			user = userData;
		}

		// For protected routes, redirect if no session or user
		if (!isPublicRoute && (!session || !user)) {
			throw redirect(303, '/');
		}
	} catch (error) {
		// If it's a redirect, throw it
		if (error instanceof Response) throw error;
		// Otherwise, we'll return with no session/user
		console.error('Auth error:', error);

		// Clear session and user if there's an auth error
		session = null;
		user = null;

		// Redirect to home if on protected route
		if (!isPublicRoute) {
			throw redirect(303, '/');
		}
	}

	return {
		session,
		user,
		url: {
			pathname: url.pathname,
			search: url.search
		},
		cookies: locals.cookies
	};
};
