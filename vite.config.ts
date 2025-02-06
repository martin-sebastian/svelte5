import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'martin-sebastian-co',
				project: 'svelte5-supabase'
			}
		}),
		sveltekit()
	],
	optimizeDeps: {
		exclude: ['@node-rs/argon2']
	}
});
