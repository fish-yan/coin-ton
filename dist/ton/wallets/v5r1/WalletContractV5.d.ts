/// <reference types="node" />
import { Address, Cell, Contract, ContractProvider, MessageRelaxed, OutActionSendMsg, Sender, SendMode } from "../../../ton-core";
import { Maybe } from "../../utils/maybe";
import { WalletIdV5R1 } from "./WalletV5R1WalletId";
import { SendArgsSignable, SendArgsSigned } from "../signing/signer";
import { OutActionWalletV5 } from "./WalletV5OutActions";
export type WalletV5R1BasicSendArgs = {
    seqno: number;
    timeout?: Maybe<number>;
};
export type WalletV5R1SendArgsSinged = WalletV5R1BasicSendArgs & SendArgsSigned & {
    authType?: 'external' | 'internal';
};
export type WalletV5R1SendArgsSignable = WalletV5R1BasicSendArgs & SendArgsSignable & {
    authType?: 'external' | 'internal';
};
export type Wallet5VR1SendArgsExtensionAuth = WalletV5R1BasicSendArgs & {
    authType: 'extension';
    queryId?: bigint;
};
export type WalletV5R1SendArgs = WalletV5R1SendArgsSinged | WalletV5R1SendArgsSignable | Wallet5VR1SendArgsExtensionAuth;
export type WalletV5R1PackedCell<T> = T extends WalletV5R1SendArgsSignable ? Promise<Cell> : Cell;
declare class WalletContractV5 implements Contract {
    static OpCodes: {
        auth_extension: number;
        auth_signed_external: number;
        auth_signed_internal: number;
    };
    readonly workchain: number;
    readonly publicKey: Buffer;
    readonly address: Address;
    readonly walletId: WalletIdV5R1;
    readonly init: {
        data: Cell;
        code: Cell;
    };
    constructor(codeString: string, workchain: number, publicKey: Buffer, walletId?: WalletIdV5R1);
    getBalance(provider: ContractProvider): Promise<bigint>;
    getSeqno(provider: ContractProvider): Promise<number>;
    getExtensions(provider: ContractProvider): Promise<Cell | null>;
    getExtensionsArray(provider: ContractProvider): Promise<Address[]>;
    getIsSecretKeyAuthEnabled(provider: ContractProvider): Promise<boolean>;
    send(provider: ContractProvider, message: Cell): Promise<void>;
    sendTransfer(provider: ContractProvider, args: WalletV5R1SendArgs & {
        secretKey: Buffer;
        messages: MessageRelaxed[];
        sendMode: SendMode;
    }): Promise<void>;
    sendAddExtension(provider: ContractProvider, args: WalletV5R1SendArgs & {
        extensionAddress: Address;
    }): Promise<void>;
    sendRemoveExtension(provider: ContractProvider, args: WalletV5R1SendArgs & {
        extensionAddress: Address;
    }): Promise<void>;
    private createActions;
    createTransfer<T extends WalletV5R1SendArgs>(args: T & {
        secretKey: Buffer;
        messages: MessageRelaxed[];
        sendMode?: Maybe<SendMode>;
    }): Cell | WalletV5R1PackedCell<{
        actions: OutActionSendMsg[];
    } & T & {
        secretKey: Buffer;
        messages: MessageRelaxed[];
        sendMode?: Maybe<SendMode>;
    }>;
    createAddExtension<T extends WalletV5R1SendArgs>(args: T & {
        extensionAddress: Address;
    }): WalletV5R1PackedCell<T>;
    createRemoveExtension<T extends WalletV5R1SendArgs>(args: T & {
        extensionAddress: Address;
    }): WalletV5R1PackedCell<T>;
    createRequest<T extends WalletV5R1SendArgs>(args: T & {
        actions: OutActionWalletV5[];
    }): WalletV5R1PackedCell<T>;
    sender(provider: ContractProvider, secretKey: Buffer): Sender;
}
export declare class WalletContractV5R1 extends WalletContractV5 {
    static create(args: {
        workchain: number;
        publicKey: Buffer;
        walletId?: WalletIdV5R1;
    }): WalletContractV5R1;
    private constructor();
}
export {};
