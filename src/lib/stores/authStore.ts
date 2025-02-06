import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

// Store to track user and auth state
export const authStore = writable<{ user: User | null; isAuthenticated: boolean }>({
	user: null,
	isAuthenticated: false
});

// Function to check initial auth state
async function checkAuth() {
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();
	if (!error) {
		authStore.set({ user, isAuthenticated: !!user });
	} else {
		authStore.set({ user: null, isAuthenticated: false });
	}
}

// Listen for auth state changes
supabase.auth.onAuthStateChange(async (event) => {
	if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
		const {
			data: { user },
			error
		} = await supabase.auth.getUser();
		if (!error) {
			authStore.set({ user, isAuthenticated: true });
		}
	} else if (event === 'SIGNED_OUT') {
		authStore.set({ user: null, isAuthenticated: false });
	}
});

// Run auth check on app start
checkAuth();
