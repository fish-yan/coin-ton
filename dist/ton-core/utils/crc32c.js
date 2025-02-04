"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crc32c = void 0;
const POLY = 0x82f63b78;
function crc32c(source) {
    let crc = 0 ^ 0xffffffff;
    for (let n = 0; n < source.length; n++) {
        crc ^= source[n];
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
    }
    crc = crc ^ 0xffffffff;
    let res = Buffer.alloc(4);
    res.writeInt32LE(crc);
    return res;
}
exports.crc32c = crc32c;
//# sourceMappingURL=crc32c.js.map