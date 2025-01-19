import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { email, password } = await request.json();

	const { data, error } = await locals.supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${request.headers.get('origin')}/auth/callback`
		}
	});

	if (error) {
		return json({ error: error.message }, { status: 400 });
	}

	return json({ user: data.user });
};
