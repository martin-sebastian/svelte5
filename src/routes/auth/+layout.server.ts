import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase }, url }) => {
	// Check if user is already logged in
	const {
		data: { user }
	} = await supabase.auth.getUser();

	// If user is already logged in, redirect to the requested page or admin
	if (user) {
		const redirectTo = url.searchParams.get('redirectTo') || '/admin';
		throw redirect(303, redirectTo);
	}

	return {
		// Return nothing since we're either redirecting or showing auth forms
	};
};
