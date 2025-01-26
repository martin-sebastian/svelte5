/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />

declare global {
	namespace App {
		interface Locals {
			supabase: import('@supabase/supabase-js').SupabaseClient;
		}
		interface PageData {
			// Empty for now
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
