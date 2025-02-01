import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: LayoutServerLoad = async ({ url }) => {
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();

	if (error || !user) {
		throw redirect(303, `/auth?redirectTo=${url.pathname}`);
	}

	return {
		user
	};
};
