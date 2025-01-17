import type { LayoutServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load: LayoutServerLoad = async (event) => {
    event.depends('supabase:auth');
    
    // Create a fake Supabase session structure
    const fakeSession = {
        access_token: 'fake_token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'fake_refresh',
        user: {
            id: '1',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'temp@example.com',
            email_confirmed_at: new Date().toISOString(),
            phone: '',
            confirmed_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            app_metadata: { provider: 'email' },
            user_metadata: {},
            identities: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    };

    return { session: fakeSession };
}; 