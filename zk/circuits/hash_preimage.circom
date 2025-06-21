pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/sha256/sha256.circom";

// This circuit proves that we know a secret (preimage) that hashes to a given public value.
// The preimage is split into 8 chunks of 256 bits (32 bytes) each.
// 256 bits * 8 = 2048 bits = 256 bytes. This is our max idea length.
template HashPreimage() {
    // Private input: the secret idea itself.
    signal input preimage[8];

    // Public input: the hash of the secret idea.
    signal output hash[2];

    // Instantiate the Sha256 circuit. It takes 256 bytes (8 * 256 bits) as input.
    component sha256 = Sha256(8);
    for (var i = 0; i < 8; i++) {
        sha256.in[i] <== preimage[i];
    }

    // The output of the sha256 component is the hash, split into two 128-bit signals.
    // We connect this to our public output.
    hash[0] <== sha256.out[0];
    hash[1] <== sha256.out[1];
}

component main = HashPreimage();