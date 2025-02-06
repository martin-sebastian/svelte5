import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createBrowserClient } from '@supabase/ssr';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth'); // Ensures auth updates properly

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: { fetch },
		auth: { persistSession: true, autoRefreshToken: true }, // ✅ Ensures session persists
		cookies: {
			get: (key) => {
				if (browser) {
					return document.cookie
						.split('; ')
						.find((row) => row.startsWith(`${key}=`))
						?.split('=')[1];
				}
				return data.cookies?.[key];
			},
			set: (key, value, options) => {
				if (browser) {
					let cookie = `${key}=${value}`;
					if (options?.expires) cookie += `; expires=${options.expires.toUTCString()}`;
					if (options?.path) cookie += `; path=${options.path}`;
					if (options?.sameSite) cookie += `; samesite=${options.sameSite}`;
					if (options?.secure) cookie += '; secure';
					document.cookie = cookie;
				}
			},
			remove: (key, options) => {
				if (browser) {
					document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${options?.path || '/'}`;
				}
			}
		}
	});

	// Fetch session data
	const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
	console.log('Session Data:', sessionData, sessionError);
	const session = sessionData?.session ?? null;

	// Fetch user if session exists
	let user = null;
	if (session) {
		const { data: userData, error: userError } = await supabase.auth.getUser();
		if (!userError) {
			user = userData.user;
		} else {
			console.error('Error fetching user:', userError);
		}
	}

	console.log('Final Session:', session);
	console.log('Final User:', user);

	return { supabase, session, user };
};
