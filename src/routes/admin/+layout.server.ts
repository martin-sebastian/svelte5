// import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
	// Only use getUser() for secure authentication
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();

	// Log the user and error for debugging
	console.log('User:', user);
	console.error('Error:', error);

	if (error || !user) {
		return {
			user: null,
			message: 'Error fetching user'
		};
	}

	return {
		user
	};
};
