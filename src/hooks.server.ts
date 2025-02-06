import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { redirect, type Handle } from '@sveltejs/kit';

Sentry.init({
	dsn: 'https://2ced5718d6fa4a68233c4ebe7198eb5f@o4507048264925184.ingest.us.sentry.io/4508769684160512'
});

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
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
});
export const handleError = Sentry.handleErrorWithSentry();
