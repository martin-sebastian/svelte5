import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		
		return session;
	};

	// Get the session
	const session = await event.locals.getSession();

	// Log the current state
	console.log('=== Auth Debug ===');
	console.log('URL:', event.url.pathname);
	console.log('Has Session:', !!session);
	if (session) {
		console.log('User:', session.user.email);
		console.log('Token:', session.access_token.slice(0, 10) + '...');
	}
	console.log('================');

	// Temporarily disable auth checks
	// if (event.url.pathname.startsWith('/admin')) {
	// 	if (event.url.pathname === '/admin/auth/login') {
	// 		if (session) {
	// 			return new Response(null, {
	// 				status: 303,
	// 				headers: { Location: '/admin/auth' }
	// 			});
	// 		}
	// 		return resolve(event);
	// 	}

	// 	if (!session) {
	// 		console.log('No session, redirecting to login');
	// 		return new Response(null, {
	// 			status: 303,
	// 			headers: { Location: '/admin/auth/login' }
	// 		});
	// 	}
	// }

	// Proceed with the request
	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});

	return response;
};
