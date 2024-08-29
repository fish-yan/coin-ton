"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeStorageUsedShort = exports.loadStorageUsedShort = void 0;
function loadStorageUsedShort(slice) {
    let cells = slice.loadVarUintBig(3);
    let bits = slice.loadVarUintBig(3);
    return {
        cells,
        bits
    };
}
exports.loadStorageUsedShort = loadStorageUsedShort;
function storeStorageUsedShort(src) {
    return (builder) => {
        builder.storeVarUint(src.cells, 3);
        builder.storeVarUint(src.bits, 3);
    };
}
exports.storeStorageUsedShort = storeStorageUsedShort;
//# sourceMappingURL=StorageUsedShort.js.map