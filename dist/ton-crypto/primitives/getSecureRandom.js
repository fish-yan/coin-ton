"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecureRandomNumber = exports.getSecureRandomWords = exports.getSecureRandomBytes = void 0;
const node_1 = require("../../ton-crypto-primitives/node");
async function getSecureRandomBytes(size) {
    return (0, node_1.getSecureRandomBytes)(size);
}
exports.getSecureRandomBytes = getSecureRandomBytes;
async function getSecureRandomWords(size) {
    return getSecureRandomWords(size);
}
exports.getSecureRandomWords = getSecureRandomWords;
async function getSecureRandomNumber(min, max) {
    let range = max - min;
    var bitsNeeded = Math.ceil(Math.log2(range));
    if (bitsNeeded > 53) {
        throw new Error('Range is too large');
    }
    var bytesNeeded = Math.ceil(bitsNeeded / 8);
    var mask = Math.pow(2, bitsNeeded) - 1;
    while (true) {
        let res = await getSecureRandomBytes(bitsNeeded);
        let power = (bytesNeeded - 1) * 8;
        let numberValue = 0;
        for (var i = 0; i < bytesNeeded; i++) {
            numberValue += res[i] * Math.pow(2, power);
            power -= 8;
        }
        numberValue = numberValue & mask;
        if (numberValue >= range) {
            continue;
        }
        return min + numberValue;
    }
}
exports.getSecureRandomNumber = getSecureRandomNumber;
//# sourceMappingURL=getSecureRandom.js.map