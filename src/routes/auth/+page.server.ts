import { fail, redirect } from '@sveltejs/kit';
import { AuthApiError } from '@supabase/supabase-js';
import type { Actions, PageServerLoad } from './$types';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load: PageServerLoad = async ({ url, locals: { user } }) => {
	// If user is already logged in, redirect to the requested page or root
	if (user) {
		const redirectTo = url.searchParams.get('redirectTo') || '/';
		throw redirect(303, redirectTo);
	}

	return {
		redirectTo: url.searchParams.get('redirectTo') || '/'
	};
};

export const actions: Actions = {
	login: async ({ request, locals: { supabase } }) => {
		console.log('Supabase URL:', PUBLIC_SUPABASE_URL);
		console.log('Supabase Key exists:', !!PUBLIC_SUPABASE_ANON_KEY);

		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const redirectTo = (formData.get('redirectTo') as string) || '/';

		console.log('Login attempt:', { email, redirectTo });

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			console.error('Login error:', error);
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					error: 'Invalid credentials'
				});
			}
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}

		// Ensure we have a session
		if (!data.session) {
			console.error('No session in login response');
			return fail(500, {
				error: 'No session created after login'
			});
		}

		console.log('Got session:', !!data.session);

		// Set the session cookie
		const { error: sessionError } = await supabase.auth.setSession({
			access_token: data.session.access_token,
			refresh_token: data.session.refresh_token
		});

		if (sessionError) {
			console.error('Session error:', sessionError);
			return fail(500, {
				error: 'Failed to create session'
			});
		}

		// Verify the session was set
		const {
			data: { session }
		} = await supabase.auth.getSession();
		console.log('Session verified:', !!session);

		console.log('Login successful, redirecting to:', redirectTo);
		throw redirect(303, redirectTo);
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
