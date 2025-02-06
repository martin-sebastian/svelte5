import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/admin';

	if (!code) {
		throw redirect(303, '/');
	}

	try {
		const { error: err } = await supabase.auth.exchangeCodeForSession(code);
		if (err) {
			console.error('Auth error:', err);
			// Even if there's an error, if we have a session, continue to admin
			const {
				data: { session }
			} = await supabase.auth.getSession();
			if (session) {
				throw redirect(303, next);
			}
			throw error(500, 'Authentication failed');
		}

		// Successful auth, redirect to admin
		throw redirect(303, next);
	} catch (e) {
		if (e instanceof Response) {
			throw e; // Rethrow redirect
		}

		// Check if we still have a valid session despite the error
		const {
			data: { session }
		} = await supabase.auth.getSession();
		if (session) {
			throw redirect(303, next);
		}

		console.error('Callback error:', e);
		throw redirect(303, '/');
	}
};
