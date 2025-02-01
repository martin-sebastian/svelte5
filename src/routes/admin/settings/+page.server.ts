import type { Actions, PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();

	if (error || !user) {
		return fail(500, { message: 'Error fetching user', user: null });
	}

	return {
		user
	};
};

export const actions: Actions = {
	updateProfile: async ({ request }) => {
		const {
			data: { user },
			error
		} = await supabase.auth.getUser();
		if (error || !user) {
			return fail(500, { message: 'Error fetching user', user: null });
		}

		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error: updateError } = await supabase.auth.updateUser({
			email: email || undefined,
			password: password || undefined
		});

		if (updateError) {
			return fail(500, { message: updateError.message, user });
		}

		return { success: true, user };
	}
};
