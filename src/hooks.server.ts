import { createSupabaseServerClient } from '$lib/server/supabase';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({ cookies: event.cookies });

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	// Protect routes except auth and root
	if (!event.url.pathname.startsWith('/auth') && event.url.pathname !== '/') {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/');
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
