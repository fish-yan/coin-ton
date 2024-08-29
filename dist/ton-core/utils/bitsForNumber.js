"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitsForNumber = void 0;
function bitsForNumber(src, mode) {
    let v = BigInt(src);
    if (mode === 'int') {
        if (v === 0n || v === -1n) {
            return 1;
        }
        let v2 = v > 0 ? v : -v;
        return (v2.toString(2).length + 1);
    }
    else if (mode === 'uint') {
        if (v < 0) {
            throw Error(`value is negative. Got ${src}`);
        }
        return (v.toString(2).length);
    }
    else {
        throw Error(`invalid mode. Got ${mode}`);
    }
}
exports.bitsForNumber = bitsForNumber;
//# sourceMappingURL=bitsForNumber.js.map