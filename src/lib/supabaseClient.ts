import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
	cookieOptions: {
		name: 'sb-auth-token',
		path: '/',
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production'
	}
});
