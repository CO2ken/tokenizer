pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ContractRegistry is Ownable {
    address public batchAddress;
    address public projectAddress;
    address public projectFactoryAddress;

    function setProjectAddress(address _address) public onlyOwner {
        projectAddress = _address;
    }
    
    function setBatchAddress(address _address) public onlyOwner {
        batchAddress = _address;
    }

    function setProjectFactoryAddress(address _address) public onlyOwner {
        projectFactoryAddress = _address;
    }
}
