/// <reference types="node" />
import inspectSymbol from 'symbol.inspect';
export declare class ADNLAddress {
    static parseFriendly(src: string): ADNLAddress;
    static parseRaw(src: string): ADNLAddress;
    readonly address: Buffer;
    constructor(address: Buffer);
    equals(b: ADNLAddress): boolean;
    toRaw: () => string;
    toString: () => string;
    [inspectSymbol]: () => string;
}
