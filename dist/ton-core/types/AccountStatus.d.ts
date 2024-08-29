import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";
export type AccountStatus = 'uninitialized' | 'frozen' | 'active' | 'non-existing';
export declare function loadAccountStatus(slice: Slice): AccountStatus;
export declare function storeAccountStatus(src: AccountStatus): (builder: Builder) => Builder;
