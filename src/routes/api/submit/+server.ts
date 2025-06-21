import { json } from '@sveltejs/kit';
import { extractText } from '$lib/server/documentExtract';
import { summarizeIdea } from '$lib/server/llmSummarize';
import { hashIdea, mintPatentNft } from '$lib/server/web3';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const file = formData.get('patent_document') as File;
		const ownerAddress = formData.get('owner_address') as string;

		if (!file || !ownerAddress) {
			return json({ error: 'No file uploaded or owner address provided.' }, { status: 400 });
		}

		// 1. Extract text from document
		const rawText = await extractText(file);
		console.log('Extracted text:', rawText);

		// 2. Summarize the core idea (LLM processing)
		const coreIdea = await summarizeIdea(rawText);
		console.log('Core idea:', coreIdea);

		// 3. Hash the core idea
		const ideaHash = hashIdea(coreIdea);
		console.log('Idea hash:', ideaHash);

		// 4. Mint the NFT with the hash
		const { receipt, tokenId } = await mintPatentNft(ownerAddress, ideaHash);
		console.log('Mint receipt:', receipt);

		// 4. Return the result
		return json({
			success: true,
			idea: coreIdea,
			ideaHash,
			transactionHash: receipt.hash,
			tokenId: tokenId,
			contractAddress: env.PATENT_NFT_CONTRACT_ADDRESS
		});
	} catch (error) {
		console.error(error);
		const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		return json({ error: errorMessage }, { status: 500 });
	}
}
