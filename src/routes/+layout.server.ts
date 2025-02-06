import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Define public routes
	const publicRoutes = [
		'/',
		'/auth',
		'/auth/login',
		'/auth/register',
		'/auth/callback',
		'/auth/confirm-email'
	];
	const isPublicRoute = publicRoutes.includes(url.pathname);

	// Get session first
	const session = await locals.getSession();

	// Only try to get user if we have a session
	const user = session ? locals.user || (await locals.supabase.auth.getUser()).data.user : null;

	// Log for debugging (remove in production)
	console.log('Auth State:', { isPublicRoute, hasSession: !!session, hasUser: !!user });

	// Redirect unauthenticated users to login
	if (!isPublicRoute && !session) {
		throw redirect(303, '/auth/login');
	}

	// Redirect authenticated users away from auth pages
	if (url.pathname.startsWith('/auth') && session) {
		throw redirect(303, '/admin');
	}

	return { session, user };
};
