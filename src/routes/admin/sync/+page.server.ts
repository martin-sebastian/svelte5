import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.auth.validate();

	if (!user) {
		throw new Error('Unauthorized');
	}

	return {
		user
	};
};
