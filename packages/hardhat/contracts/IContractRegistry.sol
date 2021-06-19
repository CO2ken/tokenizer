pragma solidity ^0.8.0;

interface IContractRegistry {
    function projectAddress() external view returns (address);

    function projectFactoryAddress() external view returns (address);
}
