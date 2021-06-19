// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol"; // dev & testing


contract CO2KenNFTCollection is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public lastDeedId;

    struct NFTData {
        string projectName;
        string vintage;
        string symbol;
        uint256 CO2tons;
        bool approved;
    }

    mapping (uint256 => NFTData) public nftData;

    constructor() ERC721("CO2KenNFTCollection", "CO2KenNFTs") {
    }


    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        console.log("DEBUG: called safeTransferFrom(): msg.sender:", msg.sender);

        safeTransferFrom(from, to, tokenId, "");
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        console.log("DEBUG sol: called transferFrom(): msg.sender:", msg.sender);
        console.log("DEBUG sol:", from, to, tokenId);


        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }


    function requestMint(
        string memory projectName,
        string memory vintage,
        string memory symbol,
        uint256 CO2tons
    ) public returns(uint256) {
        lastDeedId.increment();

        uint256 deedId = lastDeedId.current();
        _safeMint(msg.sender, deedId);

        nftData[deedId].projectName = projectName;
        nftData[deedId].vintage = vintage;
        nftData[deedId].symbol = symbol;
        nftData[deedId].CO2tons = CO2tons;

        return deedId;
    }
}
