/// <reference types="node" />
import { Address, Cell, MessageRelaxed, SendMode } from "../../ton-core";
import { Maybe } from "../../ton-core/utils/maybe";
export declare class VenomWalletV3 {
    static create(args: {
        workchain: number;
        publicKey: Buffer;
        walletId?: Maybe<number>;
    }): VenomWalletV3;
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
        globalId: number;
    }): Cell;
    createWalletTransferV3Venom(args: {
        seqno: number;
        sendMode: number;
        walletId: number;
        globalId: number;
        messages: MessageRelaxed[];
        secretKey: Buffer;
        timeout?: Maybe<number>;
    }): Cell;
}
