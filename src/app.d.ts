/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />

import { SupabaseClient, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			getSession: () => Promise<{ user: User } | null>;
			user: User | null;
		}
		interface PageData {
			user: User | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
