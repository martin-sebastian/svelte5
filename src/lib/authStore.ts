// $lib/authStore.js  (or any suitable location)
import { writable } from 'svelte/store';
import type { Session } from '@supabase/supabase-js';

export const session = writable<Session | null>(null);
export const user = writable(null); // Store the user data
