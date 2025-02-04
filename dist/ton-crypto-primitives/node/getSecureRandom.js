"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecureRandomWords = exports.getSecureRandomBytes = void 0;
const crypto_1 = __importDefault(require("crypto"));
function getSecureRandomBytes(size) {
    return crypto_1.default.randomBytes(size);
}
exports.getSecureRandomBytes = getSecureRandomBytes;
function getSecureRandomWords(size) {
    let res = new Uint16Array(size);
    crypto_1.default.randomFillSync(res);
    return res;
}
exports.getSecureRandomWords = getSecureRandomWords;
//# sourceMappingURL=getSecureRandom.js.map