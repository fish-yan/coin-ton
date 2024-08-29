/// <reference types="node" />
import { BitString } from "../BitString";
import { Cell } from "../Cell";
import { CellType } from "../CellType";
export declare function getRefsDescriptor(refs: Cell[], levelMask: number, type: CellType): number;
export declare function getBitsDescriptor(bits: BitString): number;
export declare function getRepr(originalBits: BitString, bits: BitString, refs: Cell[], level: number, levelMask: number, type: CellType): Buffer;
