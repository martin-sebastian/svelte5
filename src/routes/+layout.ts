import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createBrowserClient } from '@supabase/ssr';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: { fetch },
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
					document.cookie = `${key}=${value}; path=/; max-age=${60 * 60 * 24 * 7}`;
				}
			},
			remove: (key, options) => {
				if (browser) {
					document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
				}
			}
		}
	});

	return { supabase };
};
