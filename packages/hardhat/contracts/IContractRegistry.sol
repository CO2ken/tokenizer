pragma solidity >=0.6.0 <0.9.0;

interface IContractRegistry {
    function projectAddress() external view returns (address);

    function projectFactoryAddress() external view returns (address);
}
