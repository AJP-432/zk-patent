import { json } from '@sveltejs/kit';
import { getRecentPatents } from '$lib/server/web3';

export async function GET({ url }) {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 0);
		let patents = await getRecentPatents();

		if (limit > 0) {
			patents = patents.slice(0, limit);
		}

		return json({ success: true, patents });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		return json({ success: false, error: errorMessage }, { status: 500 });
	}
}
