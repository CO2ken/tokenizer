pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./CO2KenNFTERC20.sol";

contract CO2KenNFTCollection is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public lastDeedId;

    struct NFTData {
        string projectName;
        string vintage;
        string symbol;
        uint256 CO2tons;
        bool approved;
        CO2KenNFTERC20 ERC20;
    }

    mapping (uint256 => NFTData) public nftData;

    constructor() ERC721("CO2KenNFTCollection", "CO2KenNFTs") {
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

    function approveMinting(uint256 deedId) public onlyOwner returns (CO2KenNFTERC20) {
        require(!nftData[deedId].approved, "cannot approve twice");
        nftData[deedId].ERC20 = new CO2KenNFTERC20(
            deedId,
            nftData[deedId].projectName, // "CO2Ken projectName - Vintage ERC20"
            nftData[deedId].symbol, // "CO2Ken-symbol"
            nftData[deedId].CO2tons,
            ownerOf(deedId)
        );
        nftData[deedId].approved = true;

        return nftData[deedId].ERC20;
    }
}
