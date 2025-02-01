import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const session = await locals.getSession();

	// Protect all routes under /admin
	if (url.pathname.startsWith('/admin')) {
		if (!session) {
			throw redirect(303, '/auth');
		}
	}

	return {
		session
	};
};
