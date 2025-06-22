# ZK-Patent 🛡️

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

 <!-- You can create a simple diagram for this -->

1.  **Upload**: The user connects their wallet and uploads a document containing their idea.
2.  **Process (Backend)**:
    - The backend uses the Gemini API to summarize the document into its core concept.
    - It calculates a SHA-256 hash of this core concept.
    - It uses **Circom** and **SnarkJS** to generate a ZK-SNARK proof, proving it knows the original concept for the given hash.
3.  **Verify & Mint (On-Chain)**:
    - The backend calls the `PatentNFT` smart contract with the user's address, the public hash, and the ZK proof.
    - The smart contract's embedded `Verifier` checks the proof's validity.
    - If the proof is valid, the contract mints a new NFT to the user, permanently linking their address to the idea's unique hash.

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

The generated `Verifier.sol` is then deployed, and its address is passed to the constructor of the main `PatentNFT.sol` contract. The `circuit_final.zkey` and `circuit.wasm` files are placed in `src/lib/server/zk/` for the backend to use when generating proofs.

---

## Tech Stack

- **Frontend**: SvelteKit, Tailwind CSS
- **Blockchain**: Solidity, Ethers.js, Hardhat/Remix
- **Zero-Knowledge**: Circom, SnarkJS
- **AI**: Google Gemini API
- **Infrastructure**: Docker (for ZK setup), Vercel (for deployment)

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
- `PATENT_NFT_CONTRACT_ADDRESS`: The address of your deployed `PatentNFT` contract (you'll get this after Step 5).

### 4. Run the Development Server

You're all set! Start the SvelteKit app:

```bash
pnpm run dev
```

Open your browser to `http://localhost:5173` to use the application.

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
