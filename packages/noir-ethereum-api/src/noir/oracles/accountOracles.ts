import { ForeignCallOutput } from "@noir-lang/noir_js";
import { PublicClient } from "viem";
import { assert } from "../../assert.js";
import { decodeHexAddress, encodeField } from "../encode.js";

export interface AccountWithProof {
  balance: string,
  codeHash: string,
  nonce: string,
  stateRoot: string[],
  key: string[],
  value: string[],
  proof: string[],
  depth: string,
}

export function serializeAccountWithProof(account: AccountWithProof): ForeignCallOutput[] {
  return [
    account.balance,
    account.codeHash,
    account.nonce,
    account.stateRoot,
    account.key,
    account.value,
    account.proof,
    account.depth
  ];
}

export const getAccountOracle = async (client: PublicClient, args: string[][]): Promise<ForeignCallOutput[]> => {
  assert(args.length == 2, "get_account requires 2 arguments");
  assert(args[0].length == 1, "get_account first argument must be a block number");
  assert(args[1].length == 42, "get_account second argument must be an address");
  const address = decodeHexAddress(args[1]);
  const account = await client.getProof({ address, storageKeys: [] });

  return [
    encodeField(account.balance),
    account.codeHash,
    encodeField(account.nonce),
  ];
}