// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {UltraVerifier} from "../src/generated-verifier/UltraVerifier.sol";


contract EthereumHistoryVerifierTest is Test {
    UltraVerifier public verifier;

    function setUp() public {
        verifier = new UltraVerifier();
        vm.roll(1024);
    }

    function test_CorrectProof() public view {
        string memory proofString = vm.readLine("./test/fixtures/example.proof");
        bytes memory proof = vm.parseBytes(proofString);

        uint numberOfPublicInputs = 4498;
        bytes32[] memory publicInputs = this.loadPublicInputs("example", numberOfPublicInputs);

        verifier.verify(proof, publicInputs);
    }

    function loadPublicInputs(string memory fixtureName, uint length) public view returns (bytes32[] memory) {
        bytes32[] memory publicInputs = new bytes32[](length);
        for (uint i = 0; i < length; i++) {
            string memory fileName = string.concat("./test/fixtures/", fixtureName, ".publicInputs");
            string memory publicInputString = vm.readLine(fileName);
            bytes32 publicInput = vm.parseBytes32(publicInputString);
            publicInputs[i] = publicInput;
        }
        return publicInputs;
    }

}