import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

const protectedRoutes = ['/demo/account', '/demo/inventory', '/demo/vehicles'];

const handleAuth: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	const isProtectedRoute = protectedRoutes.some(
		(route) => path.startsWith(route) && !path.includes('/login')
	);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;

		if (isProtectedRoute) {
			throw redirect(302, '/demo/account/login');
		}
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
		if (isProtectedRoute) {
			throw redirect(302, '/demo/account/login');
		}
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle: Handle = handleAuth;
