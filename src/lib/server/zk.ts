// @ts-expect-error uses snarkjs which does not have type definitions
import { groth16 } from 'snarkjs';
// @ts-expect-error uses ffjavascript which does not have type definitions
import { utils as ffUtils } from 'ffjavascript';
import path from 'path';

// Correctly locate the circuit artifacts in a Vercel environment.
const wasmPath = path.join(
	process.cwd(),
	'circuits',
	'build',
	'hash_preimage_js',
	'hash_preimage.wasm'
);
const zkeyPath = path.join(process.cwd(), 'circuits', 'build', 'hash_preimage_0001.zkey');

console.log(`[ZK] WASM Path: ${wasmPath}`);
console.log(`[ZK] ZKEY Path: ${zkeyPath}`);

/**
 * Converts a string into the input format required by the Circom circuit.
 */
function prepareCircuitInput(idea: string): { preimage: bigint[] } {
	console.log(`[ZK] Preparing circuit input for idea: "${idea}"`);
	const ideaBytes = Buffer.from(idea, 'utf-8');

	if (ideaBytes.length > 256) {
		throw new Error(
			`Idea is too long for the circuit. Max length is 256 bytes, but got ${ideaBytes.length}.`
		);
	}
	// Pad the buffer to exactly 256 bytes with null bytes
	const paddedBytes = Buffer.alloc(256);
	ideaBytes.copy(paddedBytes);

	// Convert the 256-byte buffer into a 2048-bit array.
	const preimage: bigint[] = [];
	for (const byte of paddedBytes) {
		for (let i = 7; i >= 0; i--) {
			// Extract each bit from the byte and push it to the array
			preimage.push(BigInt((byte >> i) & 1));
		}
	}

	console.log(`[ZK] Prepared preimage with ${preimage.length} bits.`);
	return { preimage };
}

/**
 * Generates a ZK-SNARK proof for a given idea string.
 */
export async function generateProof(coreIdea: string) {
	const circuitInputs = prepareCircuitInput(coreIdea);
	console.log('[ZK] Circuit inputs prepared.');

	console.log('[ZK] Generating ZK proof... This may take a moment on a cold start.');
	const { proof, publicSignals } = await groth16.fullProve(circuitInputs, wasmPath, zkeyPath);
	console.log('[ZK] Proof generated successfully.');
	console.log(
		'[ZK] Public Signals (Hash):',
		// @ts-expect-error ffUtils.stringifyBigInts
		publicSignals.map((s) => s.toString())
	);

	return { proof, publicSignals };
}

/**
 * Generates the calldata required to call the verifier contract.
 */
export async function generateCalldata(proof: object, publicSignals: bigint[]) {
	const calldata = await groth16.exportSolidityCallData(
		ffUtils.unstringifyBigInts(proof),
		ffUtils.unstringifyBigInts(publicSignals)
	);

	const [a, b, c, input] = JSON.parse(`[${calldata}]`);
	console.log('[ZK] Generated contract calldata.');
	return { a, b, c, input };
}
