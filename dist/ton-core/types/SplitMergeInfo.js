"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeSplitMergeInfo = exports.loadSplitMergeInfo = void 0;
function loadSplitMergeInfo(slice) {
    let currentShardPrefixLength = slice.loadUint(6);
    let accountSplitDepth = slice.loadUint(6);
    let thisAddress = slice.loadUintBig(256);
    let siblingAddress = slice.loadUintBig(256);
    return {
        currentShardPrefixLength,
        accountSplitDepth,
        thisAddress,
        siblingAddress
    };
}
exports.loadSplitMergeInfo = loadSplitMergeInfo;
function storeSplitMergeInfo(src) {
    return (builder) => {
        builder.storeUint(src.currentShardPrefixLength, 6);
        builder.storeUint(src.accountSplitDepth, 6);
        builder.storeUint(src.thisAddress, 256);
        builder.storeUint(src.siblingAddress, 256);
    };
}
exports.storeSplitMergeInfo = storeSplitMergeInfo;
//# sourceMappingURL=SplitMergeInfo.js.map