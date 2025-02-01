import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: LayoutServerLoad = async () => {
	const {
		data: { user }
	} = await supabase.auth.getUser();

	return {
		user
	};
};
