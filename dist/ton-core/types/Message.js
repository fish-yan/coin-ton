"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageValue = exports.storeMessage = exports.loadMessage = void 0;
const Builder_1 = require("../boc/Builder");
const CommonMessageInfo_1 = require("./CommonMessageInfo");
const StateInit_1 = require("./StateInit");
function loadMessage(slice) {
    const info = (0, CommonMessageInfo_1.loadCommonMessageInfo)(slice);
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
exports.loadMessage = loadMessage;
function storeMessage(message, opts) {
    return (builder) => {
        builder.store((0, CommonMessageInfo_1.storeCommonMessageInfo)(message.info));
        if (message.init) {
            builder.storeBit(true);
            let initCell = (0, Builder_1.beginCell)().store((0, StateInit_1.storeStateInit)(message.init));
            let needRef = false;
            if (opts && opts.forceRef) {
                needRef = true;
            }
            else {
                needRef = builder.availableBits - 2 < initCell.bits + message.body.bits.length;
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
            needRef = builder.availableBits - 1 < message.body.bits.length ||
                builder.refs + message.body.refs.length > 4;
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
exports.storeMessage = storeMessage;
exports.MessageValue = {
    serialize(src, builder) {
        builder.storeRef((0, Builder_1.beginCell)()
            .store(storeMessage(src)));
    },
    parse(slice) {
        return loadMessage(slice.loadRef().beginParse());
    }
};
//# sourceMappingURL=Message.js.map