"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigintRandom = exports.generateQueryId = exports.buildNotcoinVoucherExchange = exports.buildNftTransferPayload = exports.signMultiTransaction = void 0;
const crypto_1 = require("crypto");
var transaction_1 = require("./transaction");
Object.defineProperty(exports, "signMultiTransaction", { enumerable: true, get: function () { return transaction_1.signMultiTransaction; } });
var nfts_1 = require("./nfts");
Object.defineProperty(exports, "buildNftTransferPayload", { enumerable: true, get: function () { return nfts_1.buildNftTransferPayload; } });
Object.defineProperty(exports, "buildNotcoinVoucherExchange", { enumerable: true, get: function () { return nfts_1.buildNotcoinVoucherExchange; } });
function generateQueryId() {
    return bigintRandom(8);
}
exports.generateQueryId = generateQueryId;
function bigintRandom(bytes) {
    let value = BigInt(0);
    for (const randomNumber of (0, crypto_1.randomBytes)(bytes)) {
        const randomBigInt = BigInt(randomNumber);
        value = (value << BigInt(8)) + randomBigInt;
    }
    return value;
}
exports.bigintRandom = bigintRandom;
//# sourceMappingURL=index.js.map