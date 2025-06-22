// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Verifier.sol"; // Import the generated Verifier

contract PatentNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Use the concrete contract type 'Verifier' instead of 'IVerifier'
    Verifier public verifier;

    // Mapping from tokenId to the idea hash (the public ZK input)
    mapping(uint256 => uint256[2]) public tokenIdToIdeaHash;

    event IdeaProven(uint256 indexed tokenId, uint256[2] ideaHash);

    // The constructor now takes the deployed Verifier contract's address
    constructor(address verifierAddress) ERC721("ZkPatent", "ZKP") Ownable(msg.sender) {
        // Cast the address to the 'Verifier' contract type
        verifier = Verifier(verifierAddress);
    }

    /**
     * @dev Mints a new NFT after verifying a ZK proof of knowledge of the idea's preimage.
     * The contract owner (your backend minter wallet) calls this function.
     */
    function mintWithProof(
        address to,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public onlyOwner {
        // Verify the proof using the verifier contract
        require(verifier.verifyProof(a, b, c, input), "Invalid ZK proof");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        
        // Store the public hash associated with this token
        tokenIdToIdeaHash[tokenId] = input;
        emit IdeaProven(tokenId, input);
    }

    // This old function is now insecure and should be removed or disabled.
    function safeMint(address to, bytes32 ideaHash) public pure onlyOwner {
        revert("safeMint is deprecated. Use mintWithProof instead.");
    }
}