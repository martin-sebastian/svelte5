import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email'),
	password: z.string().min(6, 'Password must be at least 6 characters')
});

// Define the type for our schema
type LoginSchema = typeof loginSchema;

export async function load() {
	// Create a form with the schema only, no initial data
	const form = await superValidate<LoginSchema>(loginSchema);

	return { form };
}

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate<LoginSchema>(request, loginSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) {
				return fail(400, {
					form,
					error: error.message
				});
			}

			throw redirect(303, '/dashboard'); // or wherever you want to redirect after login
		} catch (error) {
			return fail(500, {
				form,
				error: 'Server error. Please try again later.'
			});
		}
	}
};
