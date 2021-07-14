// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "hardhat/console.sol";

import "./IContractRegistry.sol";
import "./IBatchCollection.sol";
import "./ProjectCollection.sol";

contract BatchCollection is ERC721, ERC721Enumerable, Ownable, IBatchCollection {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    using Address for address;

    event BatchMinted(address sender, uint tokenId);
    event BatchUpdated(uint tokenId, string serialNumber, uint quantity);
    event BatchRetirementConfirmed(uint256 tokenId);
    
    address private _verifier;

    /// @dev A mapping from batchs IDs to the address that owns them. All batches have
    mapping (uint256 => address) public batchIndexToOwner;
    mapping (string => bool) private serialNumberExist;

    address public contractRegistry;
    Counters.Counter private _tokenIds;

    struct NFTData {
        string projectIdentifier;
        uint16 vintage;
        string serialNumber;
        uint256 quantity;
        bool confirmed;
    }

    mapping (uint256 => NFTData) public nftList;

    constructor(address _contractRegistry) ERC721("Co2ken Project Batch Collection", "Co2ken-BNFT") {
        contractRegistry = _contractRegistry;
    }

    /// @notice The verifier has the authority to confirm NFTs so ERC20's can be minted
    modifier onlyVerifier() {
        require(_verifier == _msgSender(), "BatchCollection: caller is not the owner");
        _;
    }   

    // Simple setter for verifier, there shall be multiple ones
    function setVerifier (address verifier) public onlyOwner {
        _verifier = verifier;
    }

    // confirms that claim about retirement is valid 
    function confirmRetirement (uint256 tokenId) public onlyVerifier {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");
        nftList[tokenId].confirmed = true;
        emit BatchRetirementConfirmed(tokenId);
    }


    // Permissionlessly mint empty BatchNFTs
    // To be updated by verifier/owner after SerialNumber has been provided
    function mintEmptyBatch (address to) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        // console.log("minting BRC to ", to);
        // console.log("newItemId is ", newItemId);

        batchIndexToOwner[newItemId] = to;
        _safeMint(to, newItemId);
        nftList[newItemId].confirmed = false;

        emit BatchMinted(to, newItemId);

        return newItemId;
    }


    // Updates BatchNFT after Serialnumber has been verified
    // Data is inserted by the verifier
    function updateBatchWithData
        (
        uint256 tokenId,
        string memory _projectIdentifier,
        uint16 _vintage,
        string memory _serialNumber,
        uint256 quantity
        )
        public onlyVerifier
    {
        address c = IContractRegistry(contractRegistry).projectCollectionAddress();
        require(ProjectCollection(c).projectIds(_projectIdentifier)==true, "Project does not yet exist");

        nftList[tokenId].projectIdentifier = _projectIdentifier;
        nftList[tokenId].vintage = _vintage;
        nftList[tokenId].serialNumber = _serialNumber;
        nftList[tokenId].quantity = quantity;

        require(checkSerialNumExists(_serialNumber)==false, "Serialnumber has already been used");
        serialNumberExist[_serialNumber] = true;

        emit BatchUpdated(tokenId, _serialNumber, quantity);
    }


    // Alternative flow for minting BatchNFTs
    // Can serve as a entry function if serialNumber is already known
    function mintBatchWithData(
            address to,
            string memory _projectIdentifier,
            uint16 _vintage,
            string memory _serialNumber,
            uint256 quantity
            )
            public
        {
            address c = IContractRegistry(contractRegistry).projectCollectionAddress();
            require(ProjectCollection(c).projectIds(_projectIdentifier)==true, "Project does not yet exist");
            
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            // console.log("DEBUG sol: minting to ", to);
            // console.log("DEBUG sol: newItemId is ", newItemId);
            batchIndexToOwner[newItemId] = to;

            _safeMint(to, newItemId);

            nftList[newItemId].projectIdentifier = _projectIdentifier;
            nftList[newItemId].vintage = _vintage;
            nftList[newItemId].serialNumber = _serialNumber;
            nftList[newItemId].quantity = quantity;
            nftList[newItemId].confirmed = false;
        }
    
    function checkSerialNumExists(string memory serialNo) internal view returns (bool) {
        if (serialNumberExist[serialNo]==false) return false;
        else return true;
    }


    function getProjectIdent(uint256 tokenId) public view override returns (string memory) {
        return nftList[tokenId].projectIdentifier;
    }

    function getQuantity(uint256 tokenId) public view override returns (uint) {
        return nftList[tokenId].quantity;
    }

    function getConfirmationStatus(uint256 tokenId) public view override returns (bool) {
        return nftList[tokenId].confirmed;
    }

   function getBatchNFTData(uint256 tokenId) public view override returns (string memory, uint16, string memory, uint, bool) {
        return (
            nftList[tokenId].projectIdentifier,
            nftList[tokenId].vintage,
            nftList[tokenId].serialNumber,
            nftList[tokenId].quantity,
            nftList[tokenId].confirmed
            );
    }

    // here for debugging/mock purposes. safeTransferFrom(...) is error prone with ethers.js
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {      
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        safeTransferFrom(from, to, tokenId, "");
    }


    function ownerBalanceOf(address owner) public view returns (uint256) {
        uint256 balance = balanceOf(owner);
        console.log("Owner balance is ", balance);
        return (balance);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC721, ERC721Enumerable) {
        if (to.isContract()) {
        // Reverts if NFT is send a non official pERC20 contract
        require(IContractRegistry(contractRegistry).checkERC20(to), "pERC20 contract is not official");
        }
        else {
            super._beforeTokenTransfer(from, to, amount);
        }

    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /// @dev Returns a list of all BatchIDs assigned to an address.
    function tokensOfOwner(address _owner) external view returns(NFTData[] memory ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) 
        {
            // Return an empty array
            return new NFTData[](0);
        } 
        else 
        {
            NFTData[] memory result = new NFTData[](tokenCount);
            uint256 totalNfts = totalSupply();
            uint256 resultIndex = 0;

            // We count on the fact that all nfts have IDs starting at 1 and increasing
            // sequentially up to the totalNfts count.
            uint256 nftId;

            for (nftId = 1; nftId <= totalNfts; nftId++) {
                if (batchIndexToOwner[nftId] == _owner) {
                    result[resultIndex] = nftList[nftId];
                    resultIndex++;
                }
            }

            return result;
        }
    }

    /// @dev Returns a list of all BatchIDs assigned to an address.
    function tokenIdsOfOwner(address _owner) external view returns(uint256[] memory ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) 
        {
            // Return an empty array
            return new uint256[](0);
        } 
        else 
        {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalNfts = totalSupply();
            uint256 resultIndex = 0;

            // We count on the fact that all nfts have IDs starting at 1 and increasing
            // sequentially up to the totalNfts count.
            uint256 nftId;

            for (nftId = 1; nftId <= totalNfts; nftId++) {
                if (batchIndexToOwner[nftId] == _owner) {
                    result[resultIndex] = nftId;
                    resultIndex++;
                }
            }

            return result;
        }
    }

    /// @dev Returns a list of all unconfirmed NFTs waiting for approval
    /// Note: this "Request Queue" could potentially be moved offchain, access via subgraph  
    function getTokenizationRequests() external view returns(NFTData[] memory ownerTokens) 
    {
        uint256 totalNfts = totalSupply();
        uint256 resultIndex = 0;
        NFTData[] memory result = new NFTData[](totalNfts);

        // We count on the fact that all nfts have IDs starting at 1 and increasing
        // sequentially up to the totalNfts count.
        uint256 nftId;

        for (nftId = 1; nftId <= totalNfts; nftId++) 
        {
            if (nftList[nftId].confirmed == false) 
            {
                result[resultIndex] = nftList[nftId];
                resultIndex++;
            }
        }

        return result;
    }




}
