/// <reference types="node" />
import { Address } from "../address/Address";
import { Builder } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { Slice } from "../boc/Slice";
import { BitString } from "../boc/BitString";
import { Maybe } from "../utils/maybe";
export type DictionaryKeyTypes = Address | number | bigint | Buffer | BitString;
export type DictionaryKey<K extends DictionaryKeyTypes> = {
    bits: number;
    serialize(src: K): bigint;
    parse(src: bigint): K;
};
export type DictionaryValue<V> = {
    serialize(src: V, builder: Builder): void;
    parse(src: Slice): V;
};
export declare class Dictionary<K extends DictionaryKeyTypes, V> {
    static Keys: {
        Address: () => DictionaryKey<Address>;
        BigInt: (bits: number) => DictionaryKey<bigint>;
        Int: (bits: number) => DictionaryKey<number>;
        BigUint: (bits: number) => DictionaryKey<bigint>;
        Uint: (bits: number) => DictionaryKey<number>;
        Buffer: (bytes: number) => DictionaryKey<Buffer>;
        BitString: (bits: number) => DictionaryKey<BitString>;
    };
    static Values: {
        BigInt: (bits: number) => DictionaryValue<bigint>;
        Int: (bits: number) => DictionaryValue<number>;
        BigVarInt: (bits: number) => DictionaryValue<bigint>;
        BigUint: (bits: number) => DictionaryValue<bigint>;
        Uint: (bits: number) => DictionaryValue<number>;
        BigVarUint: (bits: number) => DictionaryValue<bigint>;
        Bool: () => DictionaryValue<boolean>;
        Address: () => DictionaryValue<Address>;
        Cell: () => DictionaryValue<Cell>;
        Buffer: (bytes: number) => DictionaryValue<Buffer>;
        BitString: (bits: number) => DictionaryValue<BitString>;
        Dictionary: <K_1 extends DictionaryKeyTypes, V_1>(key: DictionaryKey<K_1>, value: DictionaryValue<V_1>) => DictionaryValue<Dictionary<K_1, V_1>>;
    };
    static empty<K extends DictionaryKeyTypes, V>(key?: Maybe<DictionaryKey<K>>, value?: Maybe<DictionaryValue<V>>): Dictionary<K, V>;
    static load<K extends DictionaryKeyTypes, V>(key: DictionaryKey<K>, value: DictionaryValue<V>, sc: Slice | Cell): Dictionary<K, V>;
    static loadDirect<K extends DictionaryKeyTypes, V>(key: DictionaryKey<K>, value: DictionaryValue<V>, sc: Slice | Cell | null): Dictionary<K, V>;
    private readonly _key;
    private readonly _value;
    private readonly _map;
    private constructor();
    get size(): number;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
    delete(key: K): boolean;
    clear(): void;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    keys(): K[];
    values(): V[];
    store(builder: Builder, key?: Maybe<DictionaryKey<K>>, value?: Maybe<DictionaryValue<V>>): void;
    storeDirect(builder: Builder, key?: Maybe<DictionaryKey<K>>, value?: Maybe<DictionaryValue<V>>): void;
    generateMerkleProof(keys: K[]): Cell;
    generateMerkleProofDirect(keys: K[]): Cell;
    generateMerkleUpdate(key: K, newValue: V): Cell;
}
