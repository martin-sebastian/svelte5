/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />

import { SupabaseClient, User, Session } from '@supabase/supabase-js';
import type { Cookies } from '@sveltejs/kit';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			getSession: () => Promise<Session | null>;
			cookies: Cookies;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
