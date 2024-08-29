"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exoticLibrary = void 0;
const BitReader_1 = require("../BitReader");
function exoticLibrary(bits, refs) {
    const reader = new BitReader_1.BitReader(bits);
    const size = 8 + 256;
    if (bits.length !== size) {
        throw new Error(`Library cell must have exactly (8 + 256) bits, got "${bits.length}"`);
    }
    let type = reader.loadUint(8);
    if (type !== 2) {
        throw new Error(`Library cell must have type 2, got "${type}"`);
    }
    return {};
}
exports.exoticLibrary = exoticLibrary;
//# sourceMappingURL=exoticLibrary.js.map