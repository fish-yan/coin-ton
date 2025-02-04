"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeTickTock = exports.loadTickTock = void 0;
function loadTickTock(slice) {
    return {
        tick: slice.loadBit(),
        tock: slice.loadBit()
    };
}
exports.loadTickTock = loadTickTock;
function storeTickTock(src) {
    return (builder) => {
        builder.storeBit(src.tick);
        builder.storeBit(src.tock);
    };
}
exports.storeTickTock = storeTickTock;
//# sourceMappingURL=TickTock.js.map