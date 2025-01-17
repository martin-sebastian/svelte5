import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createBrowserClient } from '@supabase/ssr';
import type { LayoutLoad } from './$types';

let browserClient: ReturnType<typeof createBrowserClient>;

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    if (!browserClient) {
        browserClient = createBrowserClient(
            PUBLIC_SUPABASE_URL,
            PUBLIC_SUPABASE_ANON_KEY,
            {
                global: {
                    fetch
                },
                cookies: {
                    get: (key) => data.session,
                    getAll: () => data.session ? [data.session] : [],
                    set: (key, value) => {},
                    setAll: (cookies) => {},
                    remove: (key, options) => {}
                }
            }
        );
    }

    const {
        data: { session },
    } = await browserClient.auth.getSession();

    return { supabase: browserClient, session };
}; 