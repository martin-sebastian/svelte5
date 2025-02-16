/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />

import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

declare global {
	namespace App {
		interface Locals {
			// Remove auth-related properties
		}
		interface PageData {
			// Remove auth-related properties  
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
