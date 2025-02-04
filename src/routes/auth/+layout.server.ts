import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const user = await locals.getUser();

	// Only redirect if user is authenticated AND trying to access login page
	if (user && url.pathname === '/auth') {
		throw redirect(303, '/admin');
	}

	return {
		user
	};
};
