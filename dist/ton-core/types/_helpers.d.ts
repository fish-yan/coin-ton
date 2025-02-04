import { Address } from "../address/Address";
import { Cell } from "../boc/Cell";
import { Maybe } from "../utils/maybe";
import { MessageRelaxed } from "./MessageRelaxed";
import { Message } from "./Message";
import { StateInit } from "./StateInit";
export declare function internal(src: {
    to: Address | string;
    value: bigint | string;
    bounce?: Maybe<boolean>;
    init?: Maybe<StateInit>;
    body?: Maybe<Cell | string>;
}): MessageRelaxed;
export declare function external(src: {
    to: Address | string;
    init?: Maybe<StateInit>;
    body?: Maybe<Cell>;
}): Message;
export declare function comment(src: string): Cell;
