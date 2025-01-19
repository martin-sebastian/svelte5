import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	const { error } = await locals.supabase.auth.signOut();

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	throw redirect(303, '/auth');
};
