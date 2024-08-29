/// <reference types="node" />
import { Builder, Slice } from "../../../ton-core";
export interface WalletIdV5R1<C extends WalletIdV5R1ClientContext | WalletIdV5R1CustomContext = WalletIdV5R1ClientContext | WalletIdV5R1CustomContext> {
    readonly networkGlobalId: number;
    readonly context: C;
}
export interface WalletIdV5R1ClientContext {
    readonly walletVersion: 'v5r1';
    readonly workchain: number;
    readonly subwalletNumber: number;
}
export type WalletIdV5R1CustomContext = number;
export declare function isWalletIdV5R1ClientContext(context: WalletIdV5R1ClientContext | WalletIdV5R1CustomContext): context is WalletIdV5R1ClientContext;
export declare function loadWalletIdV5R1(value: bigint | Buffer | Slice, networkGlobalId: number): WalletIdV5R1;
export declare function storeWalletIdV5R1(walletId: WalletIdV5R1): (builder: Builder) => Builder;
