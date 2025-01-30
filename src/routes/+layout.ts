import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createBrowserClient } from '@supabase/ssr';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: {
			fetch
		},
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
					if (options?.expires) {
						cookie += `; expires=${options.expires.toUTCString()}`;
					}
					if (options?.path) {
						cookie += `; path=${options.path}`;
					}
					if (options?.sameSite) {
						cookie += `; samesite=${options.sameSite}`;
					}
					if (options?.secure) {
						cookie += '; secure';
					}
					document.cookie = cookie;
				}
			},
			remove: (key, options) => {
				if (browser) {
					document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${
						options?.path || '/'
					}`;
				}
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session };
};
