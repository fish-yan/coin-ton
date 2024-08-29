/// <reference types="node" />
import inspectSymbol from 'symbol.inspect';
export declare class BitString {
    static readonly EMPTY: BitString;
    private readonly _offset;
    private readonly _length;
    private readonly _data;
    static isBitString(src: unknown): src is BitString;
    constructor(data: Buffer, offset: number, length: number);
    get length(): number;
    at(index: number): boolean;
    substring(offset: number, length: number): BitString;
    subbuffer(offset: number, length: number): Buffer | null;
    equals(b: BitString): boolean;
    toString(): string;
    [inspectSymbol]: () => string;
}
