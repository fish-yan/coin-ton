"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleLibraryValue = exports.storeSimpleLibrary = exports.loadSimpleLibrary = void 0;
function loadSimpleLibrary(slice) {
    return {
        public: slice.loadBit(),
        root: slice.loadRef()
    };
}
exports.loadSimpleLibrary = loadSimpleLibrary;
function storeSimpleLibrary(src) {
    return (builder) => {
        builder.storeBit(src.public);
        builder.storeRef(src.root);
    };
}
exports.storeSimpleLibrary = storeSimpleLibrary;
exports.SimpleLibraryValue = {
    serialize(src, builder) {
        storeSimpleLibrary(src)(builder);
    },
    parse(src) {
        return loadSimpleLibrary(src);
    },
};
//# sourceMappingURL=SimpleLibrary.js.map