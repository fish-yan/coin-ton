import { Cell } from "../../Cell";
export declare function topologicalSort(src: Cell): {
    cell: Cell;
    refs: number[];
}[];
