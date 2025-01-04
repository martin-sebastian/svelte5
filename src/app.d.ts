/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />

declare namespace App {
	interface Locals {
		user: import('$lib/server/auth').SessionValidationResult['user'];
		session: import('$lib/server/auth').SessionValidationResult['session'];
	}
}

export {};
