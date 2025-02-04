"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openBox = exports.sealBox = exports.signVerify = exports.sign = exports.keyPairFromSeed = exports.keyPairFromSecretKey = void 0;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
function keyPairFromSecretKey(secretKey) {
    let res = tweetnacl_1.default.sign.keyPair.fromSecretKey(new Uint8Array(secretKey));
    return {
        publicKey: Buffer.from(res.publicKey),
        secretKey: Buffer.from(res.secretKey),
    };
}
exports.keyPairFromSecretKey = keyPairFromSecretKey;
function keyPairFromSeed(secretKey) {
    let res = tweetnacl_1.default.sign.keyPair.fromSeed(new Uint8Array(secretKey));
    return {
        publicKey: Buffer.from(res.publicKey),
        secretKey: Buffer.from(res.secretKey),
    };
}
exports.keyPairFromSeed = keyPairFromSeed;
function sign(data, secretKey) {
    return Buffer.from(tweetnacl_1.default.sign.detached(new Uint8Array(data), new Uint8Array(secretKey)));
}
exports.sign = sign;
function signVerify(data, signature, publicKey) {
    return tweetnacl_1.default.sign.detached.verify(new Uint8Array(data), new Uint8Array(signature), new Uint8Array(publicKey));
}
exports.signVerify = signVerify;
function sealBox(data, nonce, key) {
    return Buffer.from(tweetnacl_1.default.secretbox(data, nonce, key));
}
exports.sealBox = sealBox;
function openBox(data, nonce, key) {
    let res = tweetnacl_1.default.secretbox.open(data, nonce, key);
    if (!res) {
        return null;
    }
    return Buffer.from(res);
}
exports.openBox = openBox;
//# sourceMappingURL=nacl.js.map