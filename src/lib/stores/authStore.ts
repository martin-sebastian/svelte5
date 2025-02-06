import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export const user = writable<User | null>(null);

// Initialize the store
supabase.auth.getUser().then(({ data: { user: userData }, error }) => {
	if (!error) {
		user.set(userData);
	}
});

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event) => {
	if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
		const {
			data: { user: userData },
			error
		} = await supabase.auth.getUser();
		if (!error) {
			user.set(userData);
		}
	} else if (event === 'SIGNED_OUT') {
		user.set(null);
	}
});
