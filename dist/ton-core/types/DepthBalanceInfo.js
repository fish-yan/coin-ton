"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeDepthBalanceInfo = exports.loadDepthBalanceInfo = void 0;
const CurrencyCollection_1 = require("./CurrencyCollection");
function loadDepthBalanceInfo(slice) {
    let splitDepth = slice.loadUint(5);
    return {
        splitDepth,
        balance: (0, CurrencyCollection_1.loadCurrencyCollection)(slice)
    };
}
exports.loadDepthBalanceInfo = loadDepthBalanceInfo;
function storeDepthBalanceInfo(src) {
    return (builder) => {
        builder.storeUint(src.splitDepth, 5);
        builder.store((0, CurrencyCollection_1.storeCurrencyCollection)(src.balance));
    };
}
exports.storeDepthBalanceInfo = storeDepthBalanceInfo;
//# sourceMappingURL=DepthBalanceInfo.js.map