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
