/// <reference types="node" />
import { Address } from "../address/Address";
import { ExternalAddress } from "../address/ExternalAddress";
import { Maybe } from "../utils/maybe";
import { BitString } from "./BitString";
export declare class BitBuilder {
    private _buffer;
    private _length;
    constructor(size?: number);
    get length(): number;
    writeBit(value: boolean | number): void;
    writeBits(src: BitString): void;
    writeBuffer(src: Buffer): void;
    writeUint(value: bigint | number, bits: number): void;
    writeInt(value: bigint | number, bits: number): void;
    writeVarUint(value: number | bigint, bits: number): void;
    writeVarInt(value: number | bigint, bits: number): void;
    writeCoins(amount: number | bigint): void;
    writeAddress(address: Maybe<Address | ExternalAddress>): void;
    build(): BitString;
    buffer(): Buffer;
}
