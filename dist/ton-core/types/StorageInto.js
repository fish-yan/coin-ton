"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeStorageInfo = exports.loadStorageInfo = void 0;
const StorageUsed_1 = require("./StorageUsed");
function loadStorageInfo(slice) {
    return {
        used: (0, StorageUsed_1.loadStorageUsed)(slice),
        lastPaid: slice.loadUint(32),
        duePayment: slice.loadMaybeCoins()
    };
}
exports.loadStorageInfo = loadStorageInfo;
function storeStorageInfo(src) {
    return (builder) => {
        builder.store((0, StorageUsed_1.storeStorageUsed)(src.used));
        builder.storeUint(src.lastPaid, 32);
        builder.storeMaybeCoins(src.duePayment);
    };
}
exports.storeStorageInfo = storeStorageInfo;
//# sourceMappingURL=StorageInto.js.map