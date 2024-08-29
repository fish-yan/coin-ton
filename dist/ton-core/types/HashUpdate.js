"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeHashUpdate = exports.loadHashUpdate = void 0;
function loadHashUpdate(slice) {
    if (slice.loadUint(8) !== 0x72) {
        throw Error('Invalid data');
    }
    const oldHash = slice.loadBuffer(32);
    const newHash = slice.loadBuffer(32);
    return { oldHash, newHash };
}
exports.loadHashUpdate = loadHashUpdate;
function storeHashUpdate(src) {
    return (builder) => {
        builder.storeUint(0x72, 8);
        builder.storeBuffer(src.oldHash);
        builder.storeBuffer(src.newHash);
    };
}
exports.storeHashUpdate = storeHashUpdate;
//# sourceMappingURL=HashUpdate.js.map