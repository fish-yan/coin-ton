import { Address } from "../address/Address";
import { StateInit } from "../types/StateInit";
import { Contract } from "./Contract";
import { ContractProvider } from "./ContractProvider";
export type OpenedContract<F> = {
    [P in keyof F]: P extends `${'get' | 'send'}${string}` ? (F[P] extends (x: ContractProvider, ...args: infer P) => infer R ? (...args: P) => R : never) : F[P];
};
export declare function openContract<T extends Contract>(src: T, factory: (params: {
    address: Address;
    init: StateInit | null;
}) => ContractProvider): OpenedContract<T>;
