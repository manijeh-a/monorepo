import { Hash } from 'viem';
import { encodeHexString, indentBlock, joinArray } from '../../noir/noir_js/encode.js';
import { encodeBytes32, encodeProof } from '../../noir/oracles/common/encode.js';
import { storageProofConfig } from '../../noir/oracles/common/proofConfig/storage.js';

interface StorageProof {
  key: Hash;
  proof: Hash[];
  value: bigint;
}

export function createStorageProofFixture(storageProofs: StorageProof[]): string {
  const storageProofsNoir = storageProofs.map(createSingleStorageProofFixture);
  return `use crate::account_with_storage::StorageProof;

global proofs = ${joinArray(storageProofsNoir)};
`;
}

function createSingleStorageProofFixture(storageProof: StorageProof): string {
  const key = encodeHexString(storageProof.key);
  const value = encodeBytes32(storageProof.value);
  const proof = encodeProof(storageProof.proof, storageProofConfig.maxProofLen);
  const depth = storageProof.proof.length;
  const storageProofFixture = `StorageProof {
  key: ${indentBlock(joinArray(key), 1)},
  value: ${indentBlock(joinArray(value), 1)},
  proof: ${indentBlock(joinArray(proof), 1)},
  depth: ${depth}
}`;
  return indentBlock(storageProofFixture, 1);
}