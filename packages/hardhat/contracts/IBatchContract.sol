// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

interface IBatchContract {
    function mintBatch(address, string calldata) external returns (uint256);

    function ownerOf(uint256) external view returns (address);
}
