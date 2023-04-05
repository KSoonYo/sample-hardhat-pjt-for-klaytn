// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";
import "@klaytn/contracts/KIP/token/KIP7/IKIP7.sol";
import "@klaytn/contracts/KIP/token/KIP7/IKIP7Receiver.sol";
import "@klaytn/contracts/KIP/utils/introspection/KIP13.sol";
import "@klaytn/contracts/utils/Context.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./library/KIP7Upgradeable.sol";



contract FsKlayV2 is KIP7Upgradeable {
    using AddressUpgradeable for address;
    uint256 private INIT_AMOUNT;
    
    // * receive function
    receive() external payable {}

    function initialize() initializer public {
        __KIP7_init("My Flash Token", "FsKlay");
        INIT_AMOUNT = 99999999999999;
        _mint(msg.sender, INIT_AMOUNT);
    }

    function test() external pure returns(uint){
        return 1;
    }
}

