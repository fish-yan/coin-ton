import { Cell } from "../ton-core";
export declare enum NftOpCode {
    TransferOwnership = 1607220500,
    OwnershipAssigned = 85167505
}
export declare enum OpCode {
    Comment = 0,
    Encrypted = 560454219
}
export declare function commentToBytes(comment: string): Uint8Array;
export declare function packBytesAsSnake(bytes: Uint8Array, maxBytes?: number): Uint8Array | Cell;
export declare function buildNotcoinVoucherExchange(fromAddress: string, nftAddress: string, nftIndex: number): Cell;
export declare function buildNftTransferPayload(fromAddress: string, toAddress: string, payload?: string | Cell, forwardAmount?: bigint): Cell;
