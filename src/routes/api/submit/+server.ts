import { json } from '@sveltejs/kit';
import { extractText } from '$lib/server/documentExtract';
import { summarizeIdea } from '$lib/server/llmSummarize';
import { mintPatentNftWithProof } from '$lib/server/web3';
import { generateProof, generateCalldata } from '$lib/server/zk';
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
		console.log('Extracted text:', rawText.substring(0, 100) + '...');

		// 2. Summarize the core idea (LLM processing)
		const coreIdea = await summarizeIdea(rawText);
		console.log('Core idea:', coreIdea);

		// 3. Generate ZK proof for the core idea
		const { proof, publicSignals } = await generateProof(coreIdea);

		// 4. Format proof for smart contract call
		const calldata = await generateCalldata(proof, publicSignals);

		// 5. Mint the NFT with the proof
		const { receipt, tokenId } = await mintPatentNftWithProof(ownerAddress, calldata);
		console.log('Mint receipt hash:', receipt.hash);

		// 6. Return the result
		return json({
			success: true,
			idea: coreIdea, // For display only, not stored on-chain
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
