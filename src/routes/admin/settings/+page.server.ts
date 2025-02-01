import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/auth');
	}

	return {
		session
	};
};

export const actions = {
	updateProfile: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session) {
			throw redirect(303, '/auth');
		}

		const formData = await request.formData();
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;
		const phone = formData.get('phone') as string;

		const { error } = await supabase.auth.updateUser({
			data: { firstName, lastName, phone }
		});

		if (error) {
			return fail(400, {
				error: error.message
			});
		}

		return {
			success: true
		};
	}
} satisfies Actions;
