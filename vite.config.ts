import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: ['@node-rs/argon2']
	},
	define: {
		'import.meta.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY)
	}
});
