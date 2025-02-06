import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
  const { email } = await request.json();

  const redirectTo = import.meta.env.PROD 
    ? 'https://dealerops.app/auth/callback'
    : 'http://localhost:5173/auth/callback';

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: true
    }
  });

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return json({ message: 'Check your email for the login link!' });
};