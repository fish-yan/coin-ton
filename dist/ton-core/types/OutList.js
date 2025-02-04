"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOutList = exports.storeOutList = exports.loadOutAction = exports.storeOutAction = void 0;
const MessageRelaxed_1 = require("./MessageRelaxed");
const Builder_1 = require("../boc/Builder");
function storeOutAction(action) {
    switch (action.type) {
        case 'sendMsg':
            return storeOutActionSendMsg(action);
        case 'setCode':
            return storeOutActionSetCode(action);
        default:
            throw new Error(`Unknown action type ${action.type}`);
    }
}
exports.storeOutAction = storeOutAction;
const outActionSendMsgTag = 0x0ec3c86d;
function storeOutActionSendMsg(action) {
    return (builder) => {
        builder.storeUint(outActionSendMsgTag, 32)
            .storeUint(action.mode, 8)
            .storeRef((0, Builder_1.beginCell)().store((0, MessageRelaxed_1.storeMessageRelaxed)(action.outMsg)).endCell());
    };
}
const outActionSetCodeTag = 0xad4de08e;
function storeOutActionSetCode(action) {
    return (builder) => {
        builder.storeUint(outActionSetCodeTag, 32).storeRef(action.newCode);
    };
}
function loadOutAction(slice) {
    const tag = slice.loadUint(32);
    if (tag === outActionSendMsgTag) {
        const mode = slice.loadUint(8);
        const outMsg = (0, MessageRelaxed_1.loadMessageRelaxed)(slice.loadRef().beginParse());
        return {
            type: 'sendMsg',
            mode,
            outMsg
        };
    }
    if (tag === outActionSetCodeTag) {
        const newCode = slice.loadRef();
        return {
            type: 'setCode',
            newCode
        };
    }
    throw new Error(`Unknown out action tag 0x${tag.toString(16)}`);
}
exports.loadOutAction = loadOutAction;
function storeOutList(actions) {
    const cell = actions.reduce((cell, action) => (0, Builder_1.beginCell)()
        .storeRef(cell)
        .store(storeOutAction(action))
        .endCell(), (0, Builder_1.beginCell)().endCell());
    return (builder) => {
        builder.storeSlice(cell.beginParse());
    };
}
exports.storeOutList = storeOutList;
function loadOutList(slice) {
    const actions = [];
    while (slice.remainingRefs) {
        const nextCell = slice.loadRef();
        actions.push(loadOutAction(slice));
        slice = nextCell.beginParse();
    }
    return actions.reverse();
}
exports.loadOutList = loadOutList;
//# sourceMappingURL=OutList.js.map