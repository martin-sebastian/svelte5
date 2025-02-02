import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		throw error(400, 'No code provided');
	}

	try {
		const { data, error: err } = await supabase.auth.exchangeCodeForSession(code);

		if (err) {
			console.error('Auth error:', err);
			throw error(500, 'Failed to exchange code for session');
		}

		if (!data.session) {
			throw error(500, 'No session returned');
		}

		// Explicitly set the session
		const { error: sessionError } = await supabase.auth.setSession({
			access_token: data.session.access_token,
			refresh_token: data.session.refresh_token
		});

		if (sessionError) {
			console.error('Session error:', sessionError);
			throw error(500, 'Failed to set session');
		}
	} catch (e) {
		console.error('Callback error:', e);
		throw error(500, 'Internal server error during authentication');
	}

	throw redirect(303, '/');
};
