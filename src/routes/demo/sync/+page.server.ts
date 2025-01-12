import type { PageServerLoad } from './$types';
import { validateSessionToken } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionToken = cookies.get('auth-session');

	if (!sessionToken) {
		return {
			user: null
		};
	}

	const { user } = await validateSessionToken(sessionToken);
	return {
		user
	};
};
