import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	// This only checks if the cookie exists
	const hasSession = cookies.get('auth-session');

	if (!hasSession) {
		throw redirect(302, '/admin/auth/login');
	}

	return {
		user: { id: 'system' }
	};
};
