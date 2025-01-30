/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />

declare global {
	namespace App {
		interface Locals {
			supabase: import('@supabase/supabase-js').SupabaseClient;
			getSession(): Promise<import('@supabase/supabase-js').Session | null>;
		}
		interface PageData {
			session: import('@supabase/supabase-js').Session | null;
			cookies?: Record<string, string>;
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
