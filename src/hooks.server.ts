import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event, {
		filterSerializeResponse(response) {
			return response.status === 200;
		}
	});

	return response;
};
