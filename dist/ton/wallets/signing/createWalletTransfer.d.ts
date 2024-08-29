/// <reference types="node" />
import { MessageRelaxed, Builder, OutActionSendMsg, Cell } from "../../../ton-core";
import { Maybe } from "../../utils/maybe";
import { Wallet5VR1SendArgsExtensionAuth, WalletV5R1PackedCell, WalletV5R1SendArgs } from "../v5r1/WalletContractV5";
import { OutActionExtended } from "../v5r1/WalletV5OutActions";
export declare function createWalletTransferV1(args: {
    seqno: number;
    sendMode: number;
    message: Maybe<MessageRelaxed>;
    secretKey: Buffer;
}): Cell;
export declare function createWalletTransferV2(args: {
    seqno: number;
    sendMode: number;
    messages: MessageRelaxed[];
    secretKey: Buffer;
    timeout?: Maybe<number>;
}): Cell;
export declare function createWalletTransferV3(args: {
    seqno: number;
    sendMode: number;
    walletId: number;
    messages: MessageRelaxed[];
    secretKey: Buffer;
    timeout?: Maybe<number>;
}): Cell;
export declare function createWalletTransferV4(args: {
    seqno: number;
    sendMode: number;
    walletId: number;
    messages: MessageRelaxed[];
    secretKey: Buffer;
    timeout?: Maybe<number>;
}): Cell;
export declare function createWalletTransferV5R1<T extends WalletV5R1SendArgs>(args: T extends Wallet5VR1SendArgsExtensionAuth ? T & {
    actions: (OutActionSendMsg | OutActionExtended)[];
} : T & {
    actions: (OutActionSendMsg | OutActionExtended)[];
    walletId: (builder: Builder) => void;
}): WalletV5R1PackedCell<T>;
