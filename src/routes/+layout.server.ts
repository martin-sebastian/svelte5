import { createServerClient } from '@supabase/ssr';
import type { LayoutServerLoad } from './$types';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load: LayoutServerLoad = async (event) => {
    event.depends('supabase:auth');
    
    const supabase = createServerClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get: (key) => event.cookies.get(key),
                set: (key, value, options) => {
                    event.cookies.set(key, value, options)
                },
                remove: (key, options) => {
                    event.cookies.delete(key, options)
                }
            }
        }
    );

    const { data: { session } } = await supabase.auth.getSession();
    return { session };
}; 