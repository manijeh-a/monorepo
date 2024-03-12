import { GetBlockReturnType } from 'viem';
import { encodeHexString } from '../../noir/noir_js/encode.js';
import { blockToHeader, headerToRlp } from '../../ethereum/blockHeader.js';
import { padArray } from '../../util/array.js';
import { MAX_HEADER_RLP_SIZE } from '../../noir/oracles/headerOracle/encode.js';

export function createHeaderFixture(block: GetBlockReturnType): string {
  const blockHash = encodeHexString(block.hash);
  const stateRoot = encodeHexString(block.stateRoot);
  const transactionsRoot = encodeHexString(block.transactionsRoot);
  const receiptsRoot = encodeHexString(block.receiptsRoot);

  const header = blockToHeader(block);
  const headerHex = headerToRlp(header);
  const headerUint8Array = encodeHexString(headerHex);
  const headerData = JSON.stringify(padArray(Array.from(headerUint8Array), MAX_HEADER_RLP_SIZE, 0));

  const headerFixture = `use crate::header::{BlockHeaderPartial, BlockHeaderRlp};

global number: Field = ${block.number};
global hash = [
    ${blockHash.join(',')}
];
global state_root = [
    ${stateRoot.join(',')}
];
global transactions_root = [
   ${transactionsRoot.join(',')}
];
global receipts_root = [
    ${receiptsRoot.join(',')}
];

global encoded_length: Field = ${headerUint8Array.length};
global encoded_data = ${headerData};

global block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
global block_header_rlp = BlockHeaderRlp { length: encoded_length, data: encoded_data};
`;

  return headerFixture;
}