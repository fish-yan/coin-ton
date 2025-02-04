"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha512 = exports.sha512_fallback = exports.sha512_sync = void 0;
const jssha_1 = __importDefault(require("jssha"));
const node_1 = require("../../ton-crypto-primitives/node");
function sha512_sync(source) {
    let src;
    if (typeof source === 'string') {
        src = Buffer.from(source, 'utf-8').toString('hex');
    }
    else {
        src = source.toString('hex');
    }
    let hasher = new jssha_1.default('SHA-512', 'HEX');
    hasher.update(src);
    let res = hasher.getHash('HEX');
    return Buffer.from(res, 'hex');
}
exports.sha512_sync = sha512_sync;
async function sha512_fallback(source) {
    return sha512_sync(source);
}
exports.sha512_fallback = sha512_fallback;
async function sha512(source) {
    return (0, node_1.sha512)(source);
}
exports.sha512 = sha512;
//# sourceMappingURL=sha512.js.map