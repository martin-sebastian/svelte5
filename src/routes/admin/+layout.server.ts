import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession }, url }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, `/auth?redirectTo=${url.pathname}`);
	}

	return {
		user: session.user
	};
};
