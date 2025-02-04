/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />

import { SupabaseClient, User } from '@supabase/supabase-js';
import type { Cookies } from '@sveltejs/kit';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			getUser: () => Promise<{ data: { user: User | null }; error: any }>;
			cookies: Cookies;
			user: User | null;
		}
		interface PageData {
			session: any;
			supabase: SupabaseClient;
			user: User | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
