"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeStorageUsed = exports.loadStorageUsed = void 0;
function loadStorageUsed(cs) {
    return {
        cells: cs.loadVarUintBig(3),
        bits: cs.loadVarUintBig(3),
        publicCells: cs.loadVarUintBig(3),
    };
}
exports.loadStorageUsed = loadStorageUsed;
function storeStorageUsed(src) {
    return (builder) => {
        builder.storeVarUint(src.cells, 3);
        builder.storeVarUint(src.bits, 3);
        builder.storeVarUint(src.publicCells, 3);
    };
}
exports.storeStorageUsed = storeStorageUsed;
//# sourceMappingURL=StorageUsed.js.map