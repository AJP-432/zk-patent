import { json } from '@sveltejs/kit';
import { extractText } from '$lib/server/documentExtract';
import { summarizeIdea } from '$lib/server/llmSummarize';
import {
	mintPatentNftWithProof,
	checkIfHashExists,
	invalidateCaches,
	printCaches
} from '$lib/server/web3';
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

		// 1. Extract text and summarize
		const rawText = await extractText(file);
		const coreIdea = await summarizeIdea(rawText);
		// Mock: for testing purposes, let's use a hardcoded idea
		// const rawText = 'Salty icecream';
		// const coreIdea = rawText;
		console.log('Core idea:', coreIdea);

		// 2. Generate ZK proof and calldata
		const { proof, publicSignals } = await generateProof(coreIdea);
		const calldata = await generateCalldata(proof, publicSignals);

		// 3. Check if this idea (its hash) already exists on-chain
		console.log('Calldata input:', calldata.input);
		console.log('Checking if this idea already exists on-chain...');
		printCaches();
		const alreadyExists = await checkIfHashExists(calldata.input);
		if (alreadyExists) {
			return json(
				{ error: 'This exact idea has already been timestamped. A proof of prior art exists.' },
				{ status: 409 }
			);
		}

		// 4. If it's new, mint the NFT with the proof
		const { receipt, tokenId } = await mintPatentNftWithProof(ownerAddress, calldata);
		console.log('Mint receipt hash:', receipt.hash);
		invalidateCaches();

		// 5. Return the result
		return json({
			success: true,
			idea: coreIdea,
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
