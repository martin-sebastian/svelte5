import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const { user } = await locals.auth.validate();

		// Simulate sync work
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Mock sync results (replace with your actual sync logic)
		const syncResults = {
			added: 5,
			updated: 3,
			markedAsSold: 2
		};

		return json({
			success: true,
			message: `Sync completed: ${syncResults.added} added, ${syncResults.updated} updated, ${syncResults.markedAsSold} marked as sold`,
			results: syncResults
		});
	} catch (error) {
		console.error('Sync error:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Failed to sync inventory'
			},
			{ status: 500 }
		);
	}
};
