import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";
import { StateInit } from "./StateInit";
export type AccountState = AccountStateUninit | AccountStateActive | AccountStateFrozen;
export type AccountStateUninit = {
    type: 'uninit';
};
export type AccountStateActive = {
    type: 'active';
    state: StateInit;
};
export type AccountStateFrozen = {
    type: 'frozen';
    stateHash: bigint;
};
export declare function loadAccountState(cs: Slice): AccountState;
export declare function storeAccountState(src: AccountState): (builder: Builder) => void;
