import * as auth from '$lib/server/auth';
import { redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	// Break the redirect loop if we're already on the login page
	if (url.pathname === '/admin/auth/login') {
		return {
			user: null
		};
	}

	try {
		console.log('Debug - locals:', locals);

		// Add check for locals.auth
		if (!locals.auth) {
			console.error('Auth middleware not properly initialized');
			throw redirect(302, '/admin/auth/login');
		}

		const session = await locals.auth.validate();
		console.log('Debug - session:', session);

		if (!session) {
			throw redirect(302, '/admin/auth/login');
		}

		console.log('Debug - session.user:', session.user);

		// Make sure session.user exists and has the expected properties
		if (!session.user) {
			throw error(500, 'User session is invalid');
		}

		const userData = {
			user: {
				id: session.user.userId,
				firstName: session.user.firstName,
				lastName: session.user.lastName
			}
		};

		console.log('Debug - returning userData:', userData);
		return userData;
	} catch (e) {
		console.error('Auth page load error - Full error:', e);
		throw error(500, 'Failed to load user data');
	}
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/admin/auth/login');
		}

		// Invalidate the session
		await auth.invalidateSession(session.sessionId);

		// Remove cookie
		locals.auth.setSession(null);

		// Redirect to account login page
		throw redirect(302, '/admin/auth/login');
	}
};
