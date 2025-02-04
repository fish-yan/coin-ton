"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeStateInit = exports.loadStateInit = void 0;
const Dictionary_1 = require("../dict/Dictionary");
const SimpleLibrary_1 = require("./SimpleLibrary");
const TickTock_1 = require("./TickTock");
;
function loadStateInit(slice) {
    let splitDepth;
    if (slice.loadBit()) {
        splitDepth = slice.loadUint(5);
    }
    let special;
    if (slice.loadBit()) {
        special = (0, TickTock_1.loadTickTock)(slice);
    }
    let code = slice.loadMaybeRef();
    let data = slice.loadMaybeRef();
    let libraries = slice.loadDict(Dictionary_1.Dictionary.Keys.BigUint(256), SimpleLibrary_1.SimpleLibraryValue);
    if (libraries.size === 0) {
        libraries = undefined;
    }
    return {
        splitDepth,
        special,
        code,
        data,
        libraries
    };
}
exports.loadStateInit = loadStateInit;
function storeStateInit(src) {
    return (builder) => {
        if (src.splitDepth !== null && src.splitDepth !== undefined) {
            builder.storeBit(true);
            builder.storeUint(src.splitDepth, 5);
        }
        else {
            builder.storeBit(false);
        }
        if (src.special !== null && src.special !== undefined) {
            builder.storeBit(true);
            builder.store((0, TickTock_1.storeTickTock)(src.special));
        }
        else {
            builder.storeBit(false);
        }
        builder.storeMaybeRef(src.code);
        builder.storeMaybeRef(src.data);
        builder.storeDict(src.libraries);
    };
}
exports.storeStateInit = storeStateInit;
//# sourceMappingURL=StateInit.js.map