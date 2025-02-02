import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const session = await locals.getSession();

	// If user is not authenticated, only allow access to root (login) and auth routes
	if (!session && !url.pathname.startsWith('/auth') && url.pathname !== '/') {
		throw redirect(303, '/');
	}

	return {
		session
	};
};
