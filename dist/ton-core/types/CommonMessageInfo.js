"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeCommonMessageInfo = exports.loadCommonMessageInfo = void 0;
const CurrencyCollection_1 = require("./CurrencyCollection");
function loadCommonMessageInfo(slice) {
    if (!slice.loadBit()) {
        const ihrDisabled = slice.loadBit();
        const bounce = slice.loadBit();
        const bounced = slice.loadBit();
        const src = slice.loadAddress();
        const dest = slice.loadAddress();
        const value = (0, CurrencyCollection_1.loadCurrencyCollection)(slice);
        const ihrFee = slice.loadCoins();
        const forwardFee = slice.loadCoins();
        const createdLt = slice.loadUintBig(64);
        const createdAt = slice.loadUint(32);
        return {
            type: 'internal',
            ihrDisabled,
            bounce,
            bounced,
            src,
            dest,
            value,
            ihrFee,
            forwardFee,
            createdLt,
            createdAt,
        };
    }
    if (!slice.loadBit()) {
        const src = slice.loadMaybeExternalAddress();
        const dest = slice.loadAddress();
        const importFee = slice.loadCoins();
        return {
            type: 'external-in',
            src,
            dest,
            importFee,
        };
    }
    const src = slice.loadAddress();
    const dest = slice.loadMaybeExternalAddress();
    const createdLt = slice.loadUintBig(64);
    const createdAt = slice.loadUint(32);
    return {
        type: 'external-out',
        src,
        dest,
        createdLt,
        createdAt,
    };
}
exports.loadCommonMessageInfo = loadCommonMessageInfo;
function storeCommonMessageInfo(source) {
    return (builder) => {
        if (source.type === 'internal') {
            builder.storeBit(0);
            builder.storeBit(source.ihrDisabled);
            builder.storeBit(source.bounce);
            builder.storeBit(source.bounced);
            builder.storeAddress(source.src);
            builder.storeAddress(source.dest);
            builder.store((0, CurrencyCollection_1.storeCurrencyCollection)(source.value));
            builder.storeCoins(source.ihrFee);
            builder.storeCoins(source.forwardFee);
            builder.storeUint(source.createdLt, 64);
            builder.storeUint(source.createdAt, 32);
        }
        else if (source.type === 'external-in') {
            builder.storeBit(1);
            builder.storeBit(0);
            builder.storeAddress(source.src);
            builder.storeAddress(source.dest);
            builder.storeCoins(source.importFee);
        }
        else if (source.type === 'external-out') {
            builder.storeBit(1);
            builder.storeBit(1);
            builder.storeAddress(source.src);
            builder.storeAddress(source.dest);
            builder.storeUint(source.createdLt, 64);
            builder.storeUint(source.createdAt, 32);
        }
        else {
            throw new Error('Unknown CommonMessageInfo type');
        }
    };
}
exports.storeCommonMessageInfo = storeCommonMessageInfo;
//# sourceMappingURL=CommonMessageInfo.js.map