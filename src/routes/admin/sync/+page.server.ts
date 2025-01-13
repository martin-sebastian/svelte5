import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Only sync-specific logic here
	return {};
};
