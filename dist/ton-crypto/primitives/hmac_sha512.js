"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hmac_sha512 = exports.hmac_sha512_fallback = void 0;
const jssha_1 = __importDefault(require("jssha"));
const node_1 = require("../../ton-crypto-primitives/node");
async function hmac_sha512_fallback(key, data) {
    let keyBuffer = typeof key === 'string' ? Buffer.from(key, 'utf-8') : key;
    let dataBuffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    const shaObj = new jssha_1.default("SHA-512", "HEX", {
        hmacKey: { value: keyBuffer.toString('hex'), format: "HEX" },
    });
    shaObj.update(dataBuffer.toString('hex'));
    const hmac = shaObj.getHash("HEX");
    return Buffer.from(hmac, 'hex');
}
exports.hmac_sha512_fallback = hmac_sha512_fallback;
function hmac_sha512(key, data) {
    return (0, node_1.hmac_sha512)(key, data);
}
exports.hmac_sha512 = hmac_sha512;
//# sourceMappingURL=hmac_sha512.js.map