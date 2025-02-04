import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";
import { StorageUsedShort } from "./StorageUsedShort";
export type TransactionBouncePhase = TransactionBounceNegativeFunds | TransactionBounceNoFunds | TransactionBounceOk;
export type TransactionBounceNegativeFunds = {
    type: "negative-funds";
};
export type TransactionBounceNoFunds = {
    type: "no-funds";
    messageSize: StorageUsedShort;
    requiredForwardFees: bigint;
};
export type TransactionBounceOk = {
    type: "ok";
    messageSize: StorageUsedShort;
    messageFees: bigint;
    forwardFees: bigint;
};
export declare function loadTransactionBouncePhase(slice: Slice): TransactionBouncePhase;
export declare function storeTransactionBouncePhase(src: TransactionBouncePhase): (builder: Builder) => void;
