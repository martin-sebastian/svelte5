import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	try {
		const { supabase } = locals;

		// Use getUser() instead of getSession() for secure verification
		const {
			data: { user },
			error
		} = await supabase.auth.getUser();

		if (error || !user) {
			// Clear any invalid session data
			await supabase.auth.signOut();
			throw redirect(303, '/');
		}

		// Return verified user data
		return {
			user: user
		};
	} catch (error) {
		console.error('Auth error:', error);
		throw redirect(303, '/');
	}
};
