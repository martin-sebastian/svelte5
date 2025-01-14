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
		}
	}
}

export {};
