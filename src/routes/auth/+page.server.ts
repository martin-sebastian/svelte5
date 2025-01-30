import { fail, redirect } from '@sveltejs/kit';
import { AuthApiError } from '@supabase/supabase-js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getSession }, url }) => {
	const session = await getSession();

	// If user is trying to access auth page with a redirect URL and they're logged in
	const redirectTo = url.searchParams.get('redirectTo');
	if (session && redirectTo) {
		throw redirect(303, redirectTo);
	}

	return {
		session,
		redirectTo: redirectTo || '/admin'
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;
		const phone = formData.get('phone') as string;

		const { error } = await supabase.auth.updateUser({
			data: {
				first_name: firstName,
				last_name: lastName,
				phone: phone || null // Store as null if empty
			}
		});

		if (error) {
			return fail(500, {
				error: 'Failed to update profile'
			});
		}

		return {
			success: true
		};
	},

	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, {
				error: 'Please provide both email and password'
			});
		}

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${new URL(request.url).origin}/auth/callback`
			}
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					error: 'Invalid credentials'
				});
			}
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}

		throw redirect(303, '/auth/confirm-email');
	},

	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const redirectTo = (formData.get('redirectTo') as string) || '/admin';

		if (!email || !password) {
			return fail(400, {
				error: 'Please provide both email and password'
			});
		}

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					error: 'Invalid credentials'
				});
			}
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}

		// Force a hard redirect instead of client-side navigation
		throw redirect(303, redirectTo);
	},

	signout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}
		throw redirect(303, '/');
	}
};
