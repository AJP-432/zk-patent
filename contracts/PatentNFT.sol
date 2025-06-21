// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PatentNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Mapping from tokenId to the idea hash
    mapping(uint256 => bytes32) public tokenIdToIdeaHash;

    constructor() ERC721("ZkPatent", "ZKP") Ownable(msg.sender) {}

    function safeMint(address to, bytes32 ideaHash) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        tokenIdToIdeaHash[tokenId] = ideaHash;
    }
}