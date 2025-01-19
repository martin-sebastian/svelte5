import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email'),
	password: z.string().min(6, 'Password must be at least 6 characters')
});

export const load = (async ({ locals }) => {
	// Check if user is already logged in
	const session = await locals.getSession();
	if (session) {
		throw redirect(303, '/dashboard');
	}

	const form = await superValidate(loginSchema);
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, loginSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;

		try {
			// Use locals.supabase instead of the client-side supabase instance
			const { data, error } = await locals.supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) {
				return fail(400, {
					form,
					error: error.message
				});
			}

			throw redirect(303, '/dashboard');
		} catch (error) {
			return fail(500, {
				form,
				error: 'Server error. Please try again later.'
			});
		}
	}
} satisfies Actions;
