import { supabase, theme, toggleMode } from '$lib/config';

// Environment variables and constants
export const PUBLIC_URL = 'https://dealerops.app';

// Export utilities
export { supabase } from './supabaseClient';

// Export theme utilities
export { theme, toggleMode } from './theme';

// Export any custom auth helpers
export const getUser = async () => {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	return user;
};
