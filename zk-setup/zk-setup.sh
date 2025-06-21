#!/bin/bash

# This script performs the one-time trusted setup for the ZK circuit.
# It uses Docker to create a reproducible environment, ensuring the commands work
# regardless of the host machine's configuration.

# --- Configuration ---
CIRCUIT_NAME="hash_preimage"
PTAU_POWER=16 # The power of tau ceremony file to use (e.g., 16 for 2^16 constraints)

# --- Script ---
set -e # Exit immediately if a command exits with a non-zero status.

echo "🔵 1. Building the Docker image for ZK tools..."
docker-compose build

echo "🟢 Docker image built successfully."
echo "🔵 2. Running ZK trusted setup inside the container..."

# Run all setup commands within a single Docker container instance.
# The `-c` flag allows us to pass a script as a string to bash.
docker-compose run --rm zk-tools bash -c "
  set -e
  
  echo '    🔹 Compiling the circuit...'
  mkdir -p zk/build
  circom zk/circuits/${CIRCUIT_NAME}.circom --r1cs --wasm --output zk/build

  echo '    🔹 Downloading Powers of Tau file (ptau_${PTAU_POWER})... This may take a moment.'
  wget -P zk/build https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_${PTAU_POWER}.ptau

  echo '    🔹 Setting up Phase 2...'
  snarkjs groth16 setup zk/build/${CIRCUIT_NAME}.r1cs zk/build/powersOfTau28_hez_final_${PTAU_POWER}.ptau zk/build/${CIRCUIT_NAME}_0000.zkey

  echo '    🔹 Contributing to the ceremony...'
  snarkjs zkey contribute zk/build/${CIRCUIT_NAME}_0000.zkey zk/build/${CIRCUIT_NAME}_final.zkey --name='ZK Patent 1st Contributor' -v -e='some random text'

  echo '    🔹 Exporting the verification key and Verifier contract...'
  snarkjs zkey export verificationkey zk/build/${CIRCUIT_NAME}_final.zkey zk/build/verification_key.json
  snarkjs zkey export solidityverifier zk/build/${CIRCUIT_NAME}_final.zkey contracts/Verifier.sol

  echo '✅ ZK setup complete. The Verifier.sol contract and proving keys are in your project directory.'
"

echo "✅ All steps completed successfully!"