import { ethers } from 'ethers';
import { env } from '$env/dynamic/private';

const contractAddress = env.PATENT_NFT_CONTRACT_ADDRESS;
// This is the full ABI for your deployed contract
const contractABI = [
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }
		],
		name: 'approve',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: 'verifierAddress', type: 'address' }],
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'sender', type: 'address' },
			{ internalType: 'uint256', name: 'tokenId', type: 'uint256' },
			{ internalType: 'address', name: 'owner', type: 'address' }
		],
		name: 'ERC721IncorrectOwner',
		type: 'error'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'operator', type: 'address' },
			{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }
		],
		name: 'ERC721InsufficientApproval',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'address', name: 'approver', type: 'address' }],
		name: 'ERC721InvalidApprover',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'address', name: 'operator', type: 'address' }],
		name: 'ERC721InvalidOperator',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
		name: 'ERC721InvalidOwner',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'address', name: 'receiver', type: 'address' }],
		name: 'ERC721InvalidReceiver',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'address', name: 'sender', type: 'address' }],
		name: 'ERC721InvalidSender',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
		name: 'ERC721NonexistentToken',
		type: 'error'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256[2]', name: 'a', type: 'uint256[2]' },
			{ internalType: 'uint256[2][2]', name: 'b', type: 'uint256[2][2]' },
			{ internalType: 'uint256[2]', name: 'c', type: 'uint256[2]' },
			{ internalType: 'uint256[2]', name: 'input', type: 'uint256[2]' }
		],
		name: 'mintWithProof',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
		name: 'OwnableInvalidOwner',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
		name: 'OwnableUnauthorizedAccount',
		type: 'error'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'owner', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'approved', type: 'address' },
			{ indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
		],
		name: 'Approval',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'owner', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'operator', type: 'address' },
			{ indexed: false, internalType: 'bool', name: 'approved', type: 'bool' }
		],
		name: 'ApprovalForAll',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
			{ indexed: false, internalType: 'uint256[2]', name: 'ideaHash', type: 'uint256[2]' }
		],
		name: 'IdeaProven',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
		],
		name: 'OwnershipTransferred',
		type: 'event'
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'tokenId', type: 'uint256' },
			{ internalType: 'bytes', name: 'data', type: 'bytes' }
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'operator', type: 'address' },
			{ internalType: 'bool', name: 'approved', type: 'bool' }
		],
		name: 'setApprovalForAll',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
			{ indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
		],
		name: 'Transfer',
		type: 'event'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }
		],
		name: 'transferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
		name: 'getApproved',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'operator', type: 'address' }
		],
		name: 'isApprovedForAll',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'name',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
		name: 'ownerOf',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'bytes32', name: 'ideaHash', type: 'bytes32' }
		],
		name: 'safeMint',
		outputs: [],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
		name: 'supportsInterface',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		name: 'tokenIdToIdeaHash',
		outputs: [
			{ internalType: 'uint256', name: '', type: 'uint256' },
			{ internalType: 'uint256', name: '', type: 'uint256' }
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
		name: 'tokenURI',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'verifier',
		outputs: [{ internalType: 'contract Verifier', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	}
];

// Set up a provider to connect to the blockchain
if (!env.SEPOLIA_RPC_URL) throw new Error('Missing SEPOLIA_RPC_URL environment variable');
const provider = new ethers.JsonRpcProvider(env.SEPOLIA_RPC_URL);

// Set up a wallet for your backend to sign and send transactions (the minter)
if (!env.MINTER_PRIVATE_KEY) throw new Error('Missing MINTER_PRIVATE_KEY environment variable');
const minterWallet = new ethers.Wallet(env.MINTER_PRIVATE_KEY, provider);

if (!contractAddress) throw new Error('Missing PATENT_NFT_CONTRACT_ADDRESS environment variable');
const patentNftContract = new ethers.Contract(contractAddress, contractABI, minterWallet);

console.log(`[WEB3] Initialized contract at address: ${contractAddress}`);
console.log(`[WEB3] Minter wallet address: ${minterWallet.address}`);

/**
 * Mints a new patent NFT by sending a valid ZK proof to the contract.
 * @param ownerAddress The address that will own the new NFT.
 * @param calldata The proof and public inputs formatted for the contract call.
 * @returns The transaction receipt and tokenId.
 */
export async function mintPatentNftWithProof(
	ownerAddress: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	calldata: { a: any; b: any; c: any; input: any }
) {
	try {
		console.log(`[WEB3] Preparing to mint NFT for ${ownerAddress} with ZK proof.`);
		console.log('[WEB3] Calldata public input (hash):', calldata.input);

		const tx = await patentNftContract.mintWithProof(
			ownerAddress,
			calldata.a,
			calldata.b,
			calldata.c,
			calldata.input
		);
		console.log(`[WEB3] Transaction sent. Hash: ${tx.hash}. Waiting for confirmation...`);

		const receipt = await tx.wait();
		if (!receipt) {
			throw new Error('Transaction failed to be mined.');
		}
		console.log(`[WEB3] Transaction confirmed in block: ${receipt.blockNumber}`);

		// Find the IdeaProven event to get the tokenId
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const provenEvent = receipt.logs.find((log: any) => {
			try {
				const parsedLog = patentNftContract.interface.parseLog(log);
				return parsedLog?.name === 'IdeaProven';
			} catch (e) {
				console.error('[WEB3] Error parsing log:', e);
				return false; // Not an event from this contract
			}
		});

		if (!provenEvent) {
			throw new Error('IdeaProven event not found in transaction receipt.');
		}

		const tokenId = provenEvent.args.tokenId.toString();
		console.log(`[WEB3] Successfully minted NFT with Token ID: ${tokenId}`);

		return { receipt, tokenId };
	} catch (error) {
		console.error('[WEB3] Error minting NFT with proof:', error);
		throw new Error('Failed to mint NFT with proof.');
	}
}

// --- In-Memory Caches ---
// A Set for instant hash lookups, populated on the first check.
let ideaHashesCache: Set<string> | null = null;
// An array to cache the list of patents for the UI, populated on the first load.
let recentPatentsCache:
	| { tokenId: string; transactionHash: string; blockNumber: number; minter: string }[]
	| null = null;

/**
 * Helper function to perform a one-time scan of the blockchain for all IdeaProven events.
// ...existing code...
    return exists;
}

/**
 * Fetches all minted patents by querying for Transfer events from the zero address.
 * This function uses an in-memory cache to avoid re-scanning the blockchain on every call.
 * @returns An array of patent objects, sorted from most recent to oldest.
 */
export async function getRecentPatents(): Promise<
	{ tokenId: string; transactionHash: string; blockNumber: number; minter: string }[]
> {
	// If the cache is already populated, return it instantly.
	if (recentPatentsCache !== null) {
		console.log('[CACHE] Returning cached patent list.');
		return recentPatentsCache;
	}

	try {
		// Keccak256 hash of "Transfer(address,address,uint256)"
		const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
		const zeroAddressPadded = ethers.zeroPadValue('0x0000000000000000000000000000000000000000', 32);
		console.log('[WEB3] Cache empty. Fetching all mint (Transfer) event logs from blockchain...');

		const latestBlock = await provider.getBlockNumber();
		const genesisBlock = parseInt(env.CONTRACT_GENESIS_BLOCK || '0', 10);

		// For a hackathon with few NFTs, we can query the whole range at once.
		const logs = await provider.getLogs({
			address: contractAddress,
			topics: [
				transferTopic,
				zeroAddressPadded // Filter for mints (from address is 0x0)
			],
			fromBlock: genesisBlock,
			toBlock: latestBlock
		});

		const allPatents: {
			tokenId: string;
			transactionHash: string;
			blockNumber: number;
			minter: string;
		}[] = [];

		for (const log of logs) {
			const minter = ethers.AbiCoder.defaultAbiCoder().decode(['address'], log.topics[2])[0];
			const tokenId = ethers.AbiCoder.defaultAbiCoder().decode(['uint256'], log.topics[3])[0];

			allPatents.push({
				tokenId: tokenId.toString(),
				transactionHash: log.transactionHash,
				blockNumber: log.blockNumber,
				minter: minter
			});
		}

		// Sort by block number descending (most recent first)
		allPatents.sort((a, b) => b.blockNumber - a.blockNumber);

		console.log(`[CACHE] Populating patent cache with ${allPatents.length} total mint events.`);
		// Store the result in the cache for next time.
		recentPatentsCache = allPatents;
		return recentPatentsCache;
	} catch (error) {
		console.error('[WEB3] Error fetching recent patents:', error);
		throw new Error('Failed to fetch recent patents from the blockchain.');
	}
}

/**
 * Helper function to perform a one-time scan of the blockchain for all IdeaProven events.
 * This populates our in-memory cache for fast, subsequent lookups.
 */
async function populateHashCache() {
	console.log('[CACHE] Populating idea hash cache from the blockchain...');
	// The unique signature for our contract's IdeaProven(uint256,uint256[2]) event
	const ideaProvenTopic = '0xba13f36d88fe55de914440d6c6bc4c5b4b4fe752b6f17877c430f626a2298923';

	ideaHashesCache = new Set<string>();

	try {
		const latestBlock = await provider.getBlockNumber();
		const genesisBlock = parseInt(env.CONTRACT_GENESIS_BLOCK || '0', 10);

		// For a hackathon with few NFTs, we can query the whole range at once.
		const logs = await provider.getLogs({
			address: contractAddress, // Ensures we only get events from OUR contract
			topics: [ideaProvenTopic],
			fromBlock: genesisBlock,
			toBlock: latestBlock
		});

		for (const log of logs) {
			// The ideaHash is not indexed, so it's in the 'data' field.
			const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(['uint256[2]'], log.data);
			const existingHash: [bigint, bigint] = decodedData[0];

			// Create a unique string representation for the hash to store in the Set.
			const formattedHash = `${existingHash[0].toString()}-${existingHash[1].toString()}`;
			ideaHashesCache.add(formattedHash);
		}
		console.log(`[CACHE] Cache populated with ${ideaHashesCache.size} unique idea hashes.`);
	} catch (error) {
		console.error('[CACHE] Failed to populate idea hash cache:', error);
		ideaHashesCache = null; // Reset cache on error so the next request can try again.
		throw new Error('Failed to build cache of existing ideas.');
	}
}

/**
 * Checks if a public hash already exists by looking it up in an in-memory cache.
 * The cache is populated from the blockchain on the first call.
 * @param publicSignals The public signals (the hash) from the ZK proof.
 * @returns A boolean indicating if the hash already exists.
 */
export async function checkIfHashExists(publicSignals: string[]): Promise<boolean> {
	// If the cache hasn't been populated yet, do the one-time scan.
	if (ideaHashesCache === null) {
		await populateHashCache();
	}

	// Convert publicSignals to BigInts and then toString() to ensure consistent formatting
	const part1 = BigInt(publicSignals[0]).toString();
	const part2 = BigInt(publicSignals[1]).toString();

	const hashToCheck = `${part1}-${part2}`;

	// The check is now an instant O(1) lookup in the Set.
	const exists = ideaHashesCache!.has(hashToCheck);

	if (exists) {
		console.log(`[CACHE] Hash check: FOUND. The idea already exists.`);
	} else {
		console.log(`[CACHE] Hash check: NOT FOUND. This is a new idea.`);
	}

	return exists;
}

export function invalidateCaches() {
	console.log('[CACHE] Invalidating caches due to new on-chain data.');
	ideaHashesCache = null;
	recentPatentsCache = null;
}

export function printCaches() {
	console.log('[CACHE] Current idea hash cache:', ideaHashesCache);
	console.log('[CACHE] Current recent patents cache:', recentPatentsCache);
	for (const patent of ideaHashesCache || []) {
		console.log(`[CACHE] Patent: ${patent}`);
	}
}
