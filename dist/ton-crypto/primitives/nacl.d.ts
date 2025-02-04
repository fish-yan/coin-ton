/// <reference types="node" />
export type KeyPair = {
    publicKey: Buffer;
    secretKey: Buffer;
};
export declare function keyPairFromSecretKey(secretKey: Buffer): KeyPair;
export declare function keyPairFromSeed(secretKey: Buffer): KeyPair;
export declare function sign(data: Buffer, secretKey: Buffer): Buffer;
export declare function signVerify(data: Buffer, signature: Buffer, publicKey: Buffer): boolean;
export declare function sealBox(data: Buffer, nonce: Buffer, key: Buffer): Buffer;
export declare function openBox(data: Buffer, nonce: Buffer, key: Buffer): Buffer | null;
