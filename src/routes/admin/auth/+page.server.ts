import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	// If we're already on the login page, return null user
	if (url.pathname === '/admin/auth/login') {
		return {
			user: null
		};
	}

	try {
		const { user, session } = await locals.auth.validate();

		// If no user/session, redirect to login
		if (!user || !session) {
			throw redirect(302, '/admin/auth/login');
		}

		return { user };
	} catch (e) {
		// Any error (including the 500 User session is invalid) will redirect to login
		throw redirect(302, '/admin/auth/login');
	}
};

export const actions: Actions = {
	logout: async (event) => {
		event.cookies.delete('auth-session', { path: '/' });
		throw redirect(302, '/admin/auth/login');
	}
};
