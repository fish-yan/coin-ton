import { Builder } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { Slice } from "../boc/Slice";
import { DictionaryValue } from "../dict/Dictionary";
import { Maybe } from "../utils/maybe";
import { CommonMessageInfo } from "./CommonMessageInfo";
import { StateInit } from "./StateInit";
export type Message = {
    info: CommonMessageInfo;
    init?: Maybe<StateInit>;
    body: Cell;
};
export declare function loadMessage(slice: Slice): Message;
export declare function storeMessage(message: Message, opts?: {
    forceRef?: boolean;
}): (builder: Builder) => void;
export declare const MessageValue: DictionaryValue<Message>;
