import { supabase } from './supabaseClient';
// Export utilities
export { supabase } from './supabaseClient';

// Export any custom auth helpers
export const getUser = async () => {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	return user;
};
