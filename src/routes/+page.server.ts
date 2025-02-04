import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// If you need cookies, you should access them through locals.supabase
	const { supabase } = locals;

	return {
		// Return only what's needed for public pages
	};
};
