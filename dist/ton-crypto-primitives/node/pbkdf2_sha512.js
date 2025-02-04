"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pbkdf2_sha512 = void 0;
const crypto_1 = __importDefault(require("crypto"));
function pbkdf2_sha512(key, salt, iterations, keyLen) {
    return new Promise((resolve, reject) => crypto_1.default.pbkdf2(key, salt, iterations, keyLen, 'sha512', (error, derivedKey) => {
        if (error) {
            reject(error);
        }
        else {
            resolve(derivedKey);
        }
    }));
}
exports.pbkdf2_sha512 = pbkdf2_sha512;
//# sourceMappingURL=pbkdf2_sha512.js.map