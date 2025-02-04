"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = exports.sha256_fallback = exports.sha256_sync = void 0;
const jssha_1 = __importDefault(require("jssha"));
const node_1 = require("../../ton-crypto-primitives/node");
function sha256_sync(source) {
    let src;
    if (typeof source === 'string') {
        src = Buffer.from(source, 'utf-8').toString('hex');
    }
    else {
        src = source.toString('hex');
    }
    let hasher = new jssha_1.default('SHA-256', 'HEX');
    hasher.update(src);
    let res = hasher.getHash('HEX');
    return Buffer.from(res, 'hex');
}
exports.sha256_sync = sha256_sync;
async function sha256_fallback(source) {
    return sha256_sync(source);
}
exports.sha256_fallback = sha256_fallback;
function sha256(source) {
    return (0, node_1.sha256)(source);
}
exports.sha256 = sha256;
//# sourceMappingURL=sha256.js.map