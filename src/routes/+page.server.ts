import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';
import { AuthApiError } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const {
			data: { user },
			error
		} = await supabase.auth.getUser();

		// Handle the specific case of missing session
		if (error instanceof AuthApiError && error.message.includes('Auth session missing')) {
			return {
				user: null,
				error: null // Don't treat this as an error state, user is simply not logged in
			};
		}

		if (error) {
			console.error('Auth error:', error);
			return {
				user: null,
				error: 'Authentication error'
			};
		}

		return {
			user,
			error: null
		};
	} catch (error) {
		console.error('Unexpected error:', error);
		return {
			user: null,
			error: 'An unexpected error occurred'
		};
	}
};
