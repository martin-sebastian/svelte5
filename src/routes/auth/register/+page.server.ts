import { fail, redirect } from '@sveltejs/kit';
import { AuthApiError } from '@supabase/supabase-js';
import type { Actions } from './$types';

export const actions: Actions = {
	register: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;

		if (!email || !password || !firstName || !lastName) {
			return fail(400, {
				error: 'Please fill in all fields'
			});
		}

		// Validate password strength
		if (
			password.length < 8 ||
			!/[A-Z]/.test(password) ||
			!/[a-z]/.test(password) ||
			!/[0-9]/.test(password)
		) {
			return fail(400, {
				error: 'Password does not meet requirements'
			});
		}

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName
				},
				emailRedirectTo: `${new URL(request.url).origin}/auth/callback`
			}
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					error: 'Invalid registration details'
				});
			}
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}

		// Redirect to confirmation page
		throw redirect(303, '/auth/confirm-email');
	}
};
