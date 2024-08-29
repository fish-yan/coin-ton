/// <reference types="node" />
import { Address, Cell, SendMode, MessageRelaxed } from "../../ton-core";
import { Maybe } from "../../ton-core/utils/maybe";
export declare class WalletContractV3R2 {
    static create(args: {
        workchain: number;
        publicKey: Buffer;
        walletId?: Maybe<number>;
    }): WalletContractV3R2;
    readonly workchain: number;
    readonly publicKey: Buffer;
    readonly address: Address;
    readonly walletId: number;
    readonly init: {
        data: Cell;
        code: Cell;
    };
    private constructor();
    createTransfer(args: {
        seqno: number;
        sendMode?: Maybe<SendMode>;
        secretKey: Buffer;
        messages: MessageRelaxed[];
        timeout?: Maybe<number>;
    }): Cell;
    createWalletTransferV3(args: {
        seqno: number;
        sendMode: number;
        walletId: number;
        messages: MessageRelaxed[];
        secretKey: Buffer;
        timeout?: Maybe<number>;
    }): Cell;
}
