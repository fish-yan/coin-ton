"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeMessageRelaxed = exports.loadMessageRelaxed = void 0;
const Builder_1 = require("../boc/Builder");
const CommonMessageInfoRelaxed_1 = require("./CommonMessageInfoRelaxed");
const StateInit_1 = require("./StateInit");
function loadMessageRelaxed(slice) {
    const info = (0, CommonMessageInfoRelaxed_1.loadCommonMessageInfoRelaxed)(slice);
    let init = null;
    if (slice.loadBit()) {
        if (!slice.loadBit()) {
            init = (0, StateInit_1.loadStateInit)(slice);
        }
        else {
            init = (0, StateInit_1.loadStateInit)(slice.loadRef().beginParse());
        }
    }
    const body = slice.loadBit() ? slice.loadRef() : slice.asCell();
    return {
        info,
        init,
        body
    };
}
exports.loadMessageRelaxed = loadMessageRelaxed;
function storeMessageRelaxed(message, opts) {
    return (builder) => {
        builder.store((0, CommonMessageInfoRelaxed_1.storeCommonMessageInfoRelaxed)(message.info));
        if (message.init) {
            builder.storeBit(true);
            let initCell = (0, Builder_1.beginCell)().store((0, StateInit_1.storeStateInit)(message.init));
            let needRef = false;
            if (opts && opts.forceRef) {
                needRef = true;
            }
            else {
                if (builder.availableBits - 2 >= initCell.bits) {
                    needRef = false;
                }
                else {
                    needRef = true;
                }
            }
            if (needRef) {
                builder.storeBit(true);
                builder.storeRef(initCell);
            }
            else {
                builder.storeBit(false);
                builder.storeBuilder(initCell);
            }
        }
        else {
            builder.storeBit(false);
        }
        let needRef = false;
        if (opts && opts.forceRef) {
            needRef = true;
        }
        else {
            if (builder.availableBits - 1 >= message.body.bits.length &&
                builder.refs + message.body.refs.length <= 4 &&
                !message.body.isExotic) {
                needRef = false;
            }
            else {
                needRef = true;
            }
        }
        if (needRef) {
            builder.storeBit(true);
            builder.storeRef(message.body);
        }
        else {
            builder.storeBit(false);
            builder.storeBuilder(message.body.asBuilder());
        }
    };
}
exports.storeMessageRelaxed = storeMessageRelaxed;
//# sourceMappingURL=MessageRelaxed.js.map