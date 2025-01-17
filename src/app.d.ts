/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />

import type { SessionValidationResult } from '$lib/server/auth';

declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				username: string;
				age?: number;
				firstName?: string;
				lastName?: string;
			} | null;
			auth: {
				validate: () => Promise<SessionValidationResult>;
			};
			supabase: import('@supabase/supabase-js').SupabaseClient;
			getSession: () => Promise<import('@supabase/supabase-js').Session | null>;
		}
		interface PageData {
			session: import('@supabase/supabase-js').Session | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
