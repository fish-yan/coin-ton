/// <reference types="node" />
import inspectSymbol from 'symbol.inspect';
export declare class Address {
    static isAddress(src: any): src is Address;
    static isFriendly(source: string): boolean;
    static isRaw(source: string): boolean;
    static normalize(source: string | Address): string;
    static parse(source: string): Address;
    static parseRaw(source: string): Address;
    static parseFriendly(source: string | Buffer): {
        isBounceable: boolean;
        isTestOnly: boolean;
        address: Address;
        isUrlSafe?: undefined;
    } | {
        isBounceable: boolean;
        isTestOnly: boolean;
        isUrlSafe: boolean;
        address: Address;
    };
    readonly workChain: number;
    readonly hash: Buffer;
    constructor(workChain: number, hash: Buffer);
    toRawString: () => string;
    equals(src: Address): boolean;
    toRaw: () => Buffer;
    toStringBuffer: (args?: {
        bounceable?: boolean;
        testOnly?: boolean;
    }) => Buffer;
    toString: (args?: {
        urlSafe?: boolean;
        bounceable?: boolean;
        testOnly?: boolean;
    }) => string;
    [inspectSymbol]: () => string;
}
export declare function address(src: string): Address;
