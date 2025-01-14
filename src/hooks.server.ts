import { validateSessionToken } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Get the session token from cookies
	const sessionToken = event.cookies.get('auth-session');

	// Initialize auth on event.locals
	event.locals.auth = {
		validate: async () => {
			if (!sessionToken) {
				return { user: null, session: null };
			}
			return await validateSessionToken(sessionToken);
		}
	};

	return await resolve(event);
};
