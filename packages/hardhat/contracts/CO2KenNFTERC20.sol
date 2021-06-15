pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CO2KenNFTERC20 is ERC20, Ownable {
    address public nftCollection;
    uint256 public deedId;

    constructor(
        uint256 _deedId,
        string memory name,
        string memory symbol,
        uint256 CO2tons,
        address projectOwner
    ) ERC20(name, symbol) {
        nftCollection = msg.sender;
        deedId = _deedId;
        _mint(projectOwner, CO2tons);
    }
}
