import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/admin/account');
	}
	return {
		user: event.locals.user,
		age: event.locals.user.age,
		firstName: event.locals.user.firstName,
		lastName: event.locals.user.lastName
	};
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/admin/account');
		}

		// Invalidate the session
		await auth.invalidateSession(session.sessionId);

		// Remove cookie
		locals.auth.setSession(null);

		// Redirect to account login page
		throw redirect(302, '/admin/account');
	}
};
