// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol"; // dev & testing
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./ProjectToken.sol";

contract PTokenFactory {

    event TokenCreated(address tokenAddress);

    address[] private deployedContracts; 
    mapping (string => address) public pContractRegistry;

    function deployNewToken(
        string memory _name, 
        string memory _symbol,
        string memory _vintage,
        string memory _standard,
        string memory _country) 
    public {
        console.log("DEBUG: deploying new pERC20");

        string memory _pTokenIdentifier = append(_name, _symbol, _vintage, _standard, _country);
        console.log(_pTokenIdentifier);
        require(!checkExistence(_pTokenIdentifier), "Matching pERC20 already exists");

        ProjectToken t = new ProjectToken(_name, _symbol, _vintage, _standard, _country);
        deployedContracts.push(address(t));
        console.log("Deployed new pERC20 at ", address(t));
        pContractRegistry[_pTokenIdentifier] = address(t);

        emit TokenCreated(address(t));
    }

     function deployWithTemplate(address collection, uint256 tokenId) public {
        //  string memory _vintage = IERC721(collection).nftData[tokenId].vintage;
     }



    // Helper function to create unique pERC20 identifying string
    function append(string memory a, string memory b, string memory c, string memory d, string memory e) 
        internal pure returns (string memory)  {
        return string(abi.encodePacked(a, b, c, d, e));
    }



    // Checks if same pToken has already been deployed
    function checkExistence(string memory _pTokenIdentifier) internal view returns (bool) {
        if (pContractRegistry[_pTokenIdentifier] == address(0)) {
            console.log("DEBUG: checkExistence: false");
            return false;
        }
        else {
            console.log("DEBUG: checkExistence: true");
            return true;
        }
    }


    // Lists addresses of deployed contracts
    function getContracts() public view returns (address[] memory) {
        for (uint256 i = 0; i < deployedContracts.length; i++) {
            console.log("sol: logging contract",i, deployedContracts[i]);
        } 
        // console.log(deployedContracts);
        return deployedContracts;
    }
}
