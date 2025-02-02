import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';
import { supabase } from '$lib/supabaseClient';

export const user = writable<User | null>(null);

// Initialize the store
supabase.auth.getSession().then(({ data: { session } }) => {
	user.set(session?.user ?? null);
});

// Setup auth state listener
supabase.auth.onAuthStateChange((event, session) => {
	user.set(session?.user ?? null);
});
