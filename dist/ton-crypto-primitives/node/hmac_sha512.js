"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hmac_sha512 = void 0;
const crypto_1 = __importDefault(require("crypto"));
async function hmac_sha512(key, data) {
    let keyBuffer = typeof key === 'string' ? Buffer.from(key, 'utf-8') : key;
    let dataBuffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    return crypto_1.default.createHmac('sha512', keyBuffer)
        .update(dataBuffer)
        .digest();
}
exports.hmac_sha512 = hmac_sha512;
//# sourceMappingURL=hmac_sha512.js.map