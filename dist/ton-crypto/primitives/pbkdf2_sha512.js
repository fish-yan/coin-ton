"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pbkdf2_sha512 = void 0;
const node_1 = require("../../ton-crypto-primitives/node");
function pbkdf2_sha512(key, salt, iterations, keyLen) {
    return (0, node_1.pbkdf2_sha512)(key, salt, iterations, keyLen);
}
exports.pbkdf2_sha512 = pbkdf2_sha512;
//# sourceMappingURL=pbkdf2_sha512.js.map