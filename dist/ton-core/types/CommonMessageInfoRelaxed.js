"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeCommonMessageInfoRelaxed = exports.loadCommonMessageInfoRelaxed = void 0;
const CurrencyCollection_1 = require("./CurrencyCollection");
function loadCommonMessageInfoRelaxed(slice) {
    if (!slice.loadBit()) {
        const ihrDisabled = slice.loadBit();
        const bounce = slice.loadBit();
        const bounced = slice.loadBit();
        const src = slice.loadMaybeAddress();
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
        throw Error('External In message is not possible for CommonMessageInfoRelaxed');
    }
    const src = slice.loadMaybeAddress();
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
exports.loadCommonMessageInfoRelaxed = loadCommonMessageInfoRelaxed;
function storeCommonMessageInfoRelaxed(source) {
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
exports.storeCommonMessageInfoRelaxed = storeCommonMessageInfoRelaxed;
//# sourceMappingURL=CommonMessageInfoRelaxed.js.map