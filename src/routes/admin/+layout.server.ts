import type { LayoutServerLoad } from './$types';
import { validateSessionToken } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const sessionToken = cookies.get('auth-session');

	if (!sessionToken) {
		throw redirect(303, '/admin/account/login');
	}

	const { user } = await validateSessionToken(sessionToken);

	if (!user) {
		throw redirect(303, '/admin/account/login');
	}

	return {
		user
	};
};
