pragma circom 2.0.0;

include "sha256.circom";

// This circuit takes a 2048-bit (256-byte) preimage and computes its SHA-256 hash.
template HashPreimage() {
    // The input is a private signal: the secret idea.
    signal input preimage[2048]; 
    // The output is the resulting hash. The compiler will automatically treat this
    // as a public signal for the final proof.
    signal output hash[2];

    component sha256 = Sha256(2048);
    for (var i = 0; i < 2048; i++) {
        sha256.in[i] <== preimage[i];
    }

    // The output of sha256 is 256 bits. We pack it into two uint256 values
    // to make it easier to handle as a public input in Solidity.
    var lc1 = 0;
    var lc2 = 0;
    for (var i = 0; i<128; i++) {
        lc1 += sha256.out[i] * (2**i);
    }
    for (var i = 128; i<256; i++) {
        lc2 += sha256.out[i] * (2**(i-128));
    }
    hash[0] <== lc1;
    hash[1] <== lc2;
}

// By instantiating the template, its 'output' signals become the public
// signals of the circuit. No extra 'public' keyword is needed.
component main = HashPreimage();