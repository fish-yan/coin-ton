/// <reference types="node" />
import { BitString } from "../BitString";
import { Cell } from "../Cell";
export declare function exoticMerkleProof(bits: BitString, refs: Cell[]): {
    proofDepth: number;
    proofHash: Buffer;
};
export declare function convertToMerkleProof(c: Cell): Cell;
