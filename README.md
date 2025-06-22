# ZK-Patent 🛡️ (see attached ppt and [video](https://www.youtube.com/watch?v=jWeyQitU2vc))

**Secure your ideas the moment they're conceived. ZK-Patent uses AI, Zero-Knowledge Proofs, and NFTs to create immutable, privacy-preserving timestamps for your intellectual property.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## The Problem

When you have a groundbreaking idea, you want to establish proof of prior art without revealing the idea itself. Publicly disclosing details can jeopardize your ability to patent it later, while keeping it secret offers no protection against others claiming it first.

## The Solution

ZK-Patent solves this dilemma by leveraging the power of modern cryptography and blockchain technology.

1.  **AI-Powered Summarization**: An AI extracts the core essence of your uploaded document.
2.  **Zero-Knowledge Proof**: We generate a cryptographic proof that you possess this core idea _without ever revealing the idea itself_.
3.  **On-Chain Timestamp**: This proof is verified by a smart contract, which then mints an NFT to your wallet. This NFT serves as an immutable, publicly verifiable, yet private timestamp of your invention.

You can prove you had the idea at a specific time, without ever putting the idea on-chain. **Innovate, protect, publish – faster than ever.**

---

## How It Works

1.  **Upload**: The user connects their wallet and uploads a document containing their idea.
2.  **Process (Backend)**:
    - The backend uses the Gemini API to summarize the document into its core concept.
    - It calculates a hash of this core concept using Poseidon hashing.
    - It uses **Circom** and **SnarkJS** to generate a ZK-SNARK proof, proving it knows the original concept for the given hash.
3.  **Verify & Mint (On-Chain)**:
    - The backend calls the `PatentNFT` smart contract with the user's address and the ZK proof.
    - The smart contract's embedded `Verifier` checks the proof's validity using on-chain verification.
    - If the proof is valid, the contract mints a new NFT to the user, permanently linking their address to the idea's unique hash.

---

## Smart Contract Architecture

The system consists of two main smart contracts deployed on Ethereum:

### 1. Verifier Contract (`Verifier.sol`)

- **Purpose**: Verifies ZK-SNARK proofs on-chain
- **Generated**: Automatically created from the Circom circuit using SnarkJS
- **Function**: `verifyProof(uint[2] _pA, uint[2][2] _pB, uint[2] _pC, uint[2] _pubSignals)`
- **Security**: Uses Groth16 proving system with precomputed verification keys
- **Gas Efficient**: Optimized assembly code for elliptic curve operations

```solidity
// Core verification function
function verifyProof(
    uint[2] calldata _pA,
    uint[2][2] calldata _pB,
    uint[2] calldata _pC,
    uint[2] calldata _pubSignals
) public view returns (bool)
```

### 2. PatentNFT Contract (`PatentNFT.sol`)

- **Purpose**: Main contract that mints NFTs after proof verification
- **Inherits**: ERC721 (NFT standard), Ownable (access control)
- **Key Features**:
  - Integrates with Verifier contract for proof validation
  - Maps each NFT to its corresponding idea hash
  - Emits events for tracking patent registrations
  - Only contract owner (backend minter) can mint NFTs

```solidity
// Main minting function with ZK proof verification
function mintWithProof(
    address to,
    uint256[2] memory a,
    uint256[2][2] memory b,
    uint256[2] memory c,
    uint256[2] memory input
) public onlyOwner
```

**Contract Flow:**

1. Backend generates ZK proof for user's idea
2. Backend calls `mintWithProof()` with proof parameters
3. PatentNFT calls Verifier to validate the proof
4. If valid, NFT is minted and idea hash is stored
5. `IdeaProven` event is emitted for indexing

---

## Zero-Knowledge Circuit Setup

This project relies on pre-compiled ZK-SNARK artifacts: a prover key (`.zkey`), a WebAssembly circuit (`.wasm`), and a Solidity verifier contract (`Verifier.sol`). Here is the high-level process used to generate them.

### 1. Write the Circuit

The core of the ZK logic is in `circuits/circuit.circom`. This circuit takes a private input (the `preimage` of the idea), computes its Poseidon hash, and exposes the resulting hash as a public output. This allows us to prove we know the `preimage` for a given public hash without revealing it.

### 2. Compile the Circuit

First, compile the `.circom` file. This generates the R1CS (Rank-1 Constraint System) file, which is a mathematical representation of the circuit, and the `.wasm` file used for generating proofs.

```bash
# Create a directory for the output files
mkdir -p circuits/compiled

# Compile the circuit
circom circuits/circuit.circom --r1cs --wasm --sym -o circuits/compiled
```

### 3. Powers of Tau Ceremony (Phase 1)

To create a secure ZK-SNARK, we start with a "Powers of Tau" file from a trusted public ceremony. This is a universal setup that can be used for any circuit up to a certain size. We'll use a file that supports up to 2^20 constraints, which is more than sufficient.

```bash
# Download the .ptau file
curl -o circuits/powers_of_tau_28_hez_final_20.ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_20.ptau
```

### 4. Generate the ZKey (Phase 2)

Next, we use `snarkjs` to create the initial prover key (`.zkey`) for our specific circuit using the `.ptau` file.

```bash
snarkjs groth16 setup circuits/compiled/circuit.r1cs circuits/powers_of_tau_28_hez_final_20.ptau circuits/compiled/circuit_0000.zkey
```

### 5. Contribute to the ZKey

For a production system, this `.zkey` would need multiple contributions from different parties to be secure. For this project, a single contribution is sufficient to finalize the key.

```bash
snarkjs zkey contribute circuits/compiled/circuit_0000.zkey circuits/compiled/circuit_final.zkey --name="zk-patent 1st contribution" -v -e="some random text for entropy"
```

### 6. Export the Verifier Contract

Finally, we export the verifier from our final `.zkey`. This generates a Solidity smart contract (`Verifier.sol`) that can verify proofs on-chain.

```bash
snarkjs zkey export solidityverifier circuits/compiled/circuit_final.zkey contracts/Verifier.sol
```

The generated `Verifier.sol` is then deployed, and its address is passed to the constructor of the main `PatentNFT.sol` contract. The `circuit_final.zkey` and `circuit.wasm` files are placed in `circuits/compiled/` for the backend to use when generating proofs.

---

## Tech Stack

### Frontend

- **Svelte 5**: Latest version with modern reactivity and performance improvements
- **SvelteKit 2**: Full-stack framework with SSR/SSG capabilities and API routes
- **Tailwind CSS v4**: Utility-first CSS framework for rapid UI development
- **shadcn-svelte**: High-quality, accessible component library built on Radix primitives

### Blockchain & Cryptography

- **Solidity**: Smart contract programming language
- **Ethers.js**: Ethereum JavaScript library for blockchain interactions
- **Circom**: Domain-specific language for writing arithmetic circuits
- **SnarkJS**: JavaScript library for generating and verifying ZK-SNARK proofs
- **Groth16**: Zero-knowledge proof system for efficient verification

### Backend & AI

- **Google Gemini API**: Advanced AI for document analysis and idea extraction
- **Node.js**: Server-side JavaScript runtime
- **SvelteKit API Routes**: Server-side API endpoints with built-in request handling

### Infrastructure & DevOps

- **Vercel**: Serverless deployment platform with edge functions (turned off for now)
- **TypeScript**: Type-safe JavaScript for better developer experience
- **ESLint & Prettier**: Code linting and formatting tools
- **Husky**: Git hooks for automated quality checks

### Development Tools

- **Vite**: Fast build tool with hot module replacement
- **pnpm**: Efficient package manager with workspace support
- **MDsveX**: Markdown preprocessing for documentation
- **Commitlint**: Conventional commit message enforcement

---

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started) and Docker Compose

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/zk-patent.git
cd zk-patent
```

### 2. Install Dependencies

This command installs all necessary packages and creates the `pnpm-lock.yaml` file, which is crucial for the Docker build step.

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in the following values:

- `GEMINI_API_KEY`: Your API key for the Google Gemini AI service.
- `SEPOLIA_RPC_URL`: Your RPC endpoint URL for the Sepolia testnet (e.g., from Alchemy or Infura).
- `MINTER_PRIVATE_KEY`: The private key of the wallet that will pay the gas fees to mint the NFTs. **This wallet must be the owner of the deployed smart contract.**
- `PATENT_NFT_CONTRACT_ADDRESS`: The address of your deployed `PatentNFT` contract.
- `CONTRACT_GENESIS_BLOCK`: The block number when your contract was deployed (for efficient event scanning).

### 4. Run the Development Server

You're all set! Start the SvelteKit app:

```bash
pnpm run dev
```

Open your browser to `http://localhost:5173` to use the application.

---

## Project Structure

```
zk-patent/
├── circuits/                 # ZK circuit files
│   ├── circuit.circom       # Core ZK circuit definition
│   └── compiled/            # Compiled circuit artifacts
├── contracts/               # Smart contracts
│   ├── PatentNFT.sol       # Main NFT contract
│   └── Verifier.sol        # ZK proof verifier
├── src/
│   ├── lib/
│   │   ├── components/     # Svelte components
│   │   └── server/         # Server-side utilities
│   └── routes/             # SvelteKit routes and API endpoints
└── static/                 # Static assets
```

---

## Contributing & Development

We welcome contributions! This project uses `prettier` for code formatting and `eslint` for linting.

### Automated Quality Checks with Husky

This project is equipped with [Husky](https://typicode.github.io/husky/), which sets up Git hooks to automate quality checks. After you run `pnpm install`, Husky is automatically configured.

When you make a commit, Husky will automatically:

1.  Run `prettier` to format your staged files.
2.  Run `eslint` to check for any linting errors.
3.  Run `commitlint` to ensure your commit message follows the [Conventional Commits](https://www.conventionalcommits.org/) standard.

If any of these checks fail, your commit will be aborted. This ensures that all code committed to the repository maintains a consistent style and quality.

---

## Security Considerations

- **Private Key Management**: The minter private key is stored securely and only used for transaction signing
- **ZK Circuit Security**: Circuit undergoes trusted setup ceremony for cryptographic security
- **Smart Contract Access Control**: Only authorized minter can mint NFTs
- **Proof Verification**: All proofs are verified on-chain before minting
- **Idea Privacy**: Original ideas never leave the user's device or backend processing
