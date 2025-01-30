import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession }, cookies }) => {
	return {
		session: await getSession(),
		cookies: Object.fromEntries(cookies.getAll().map((cookie) => [cookie.name, cookie.value]))
	};
};
