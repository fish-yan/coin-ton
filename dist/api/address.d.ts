import { Address } from "../ton-core";
export type ApiNetwork = 'mainnet' | 'testnet';
export declare function getPubKeyBySeed(seed: string): string;
export declare function checkSeed(seed: string): void;
export declare function getAddressBySeed(seed: string, testOnly?: boolean): string;
export declare function getV5R1AddressBySeed(seed: string, testOnly?: boolean): string;
export declare function parseAddress(address: string): {
    isValid: boolean;
    isRaw?: boolean;
    isUserFriendly?: boolean;
    isBounceable?: boolean;
    isTestOnly?: boolean;
    address?: Address;
    isUrlSafe?: boolean;
};
export declare function getVenomAddressBySeed(seed: string): string;
export declare function validateAddress(address: string): false | Address;
export declare function convertAddress(address: string): any;
export declare function toBase64Address(address: Address | string, isBounceable?: boolean, network?: ApiNetwork): string;
