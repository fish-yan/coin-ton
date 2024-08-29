import { Address } from "../address/Address";
import { StateInit } from "../types/StateInit";
import { Maybe } from "../utils/maybe";
import { ContractABI } from "./ContractABI";
export interface Contract {
    readonly address: Address;
    readonly init?: Maybe<StateInit>;
    readonly abi?: Maybe<ContractABI>;
}
