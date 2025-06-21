import { json } from '@sveltejs/kit';
import { extractText } from '$lib/server/documentExtract';
import { summarizeIdea } from '$lib/server/llmSummarize';

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const file = formData.get('patent_document') as File;

		if (!file) {
			return json({ error: 'No file uploaded.' }, { status: 400 });
		}

		// Extract text from document
		const rawText = await extractText(file);

		// Summarize the core idea (LLM processing)
		const coreIdea = await summarizeIdea(rawText);

		return json({ success: true, idea: coreIdea });
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		return json({ error: errorMessage }, { status: 500 });
	}
}
