import { TonTransferParams } from "./types";
export type TxData = {
    type: string;
    to: string;
    amount: string;
    seqno: number;
    toIsInit: boolean;
    decimal: number;
    memo?: string;
    globalId?: number;
    sendMode?: number;
    expireAt?: number;
    publicKey?: string;
    version?: string;
};
export type JettonTxData = {
    type: string;
    to: string;
    fromJettonAccount: string;
    amount: string;
    decimal: number;
    seqno: number;
    toIsInit: boolean;
    memo?: string;
    messageAttachedTons?: string;
    invokeNotificationFee?: string;
    sendMode?: number;
    expireAt?: number;
    queryId?: string;
    publicKey?: string;
};
export declare function transfer(txData: TxData, seed: string, walletVersion?: string): {
    boc: string;
};
export declare function venomTransfer(txData: TxData, seed: string): {
    id: string;
    body: string;
};
export declare function jettonTransfer(txData: JettonTxData, seed: string, walletVersion?: string): {
    boc: string;
};
export declare function signMultiTransaction(privateKey: string, messages: TonTransferParams[], seqno: number, expireAt?: number, workchain?: number, publicKey?: string, walletVersion?: string): Promise<{
    seqno: number;
    transaction: string;
    externalMessage: string;
}>;
