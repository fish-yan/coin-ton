/// <reference types="node" />
import inspectSymbol from 'symbol.inspect';
import { BitString } from "./BitString";
import { CellType } from "./CellType";
import { Slice } from "./Slice";
import { LevelMask } from './cell/LevelMask';
export declare class Cell {
    static readonly EMPTY: Cell;
    static fromBoc(src: Buffer): Cell[];
    static fromBase64(src: string): Cell;
    readonly type: CellType;
    readonly bits: BitString;
    readonly refs: Cell[];
    readonly mask: LevelMask;
    private _hashes;
    private _depths;
    constructor(opts?: {
        exotic?: boolean;
        bits?: BitString;
        refs?: Cell[];
    });
    get isExotic(): boolean;
    beginParse: (allowExotic?: boolean) => Slice;
    hash: (level?: number) => Buffer;
    depth: (level?: number) => number;
    level: () => number;
    equals: (other: Cell) => boolean;
    toBoc(opts?: {
        idx?: boolean | null | undefined;
        crc32?: boolean | null | undefined;
    }): Buffer;
    toString(indent?: string): string;
    asSlice(): Slice;
    asBuilder(): import("./Builder").Builder;
    [inspectSymbol]: () => string;
}
