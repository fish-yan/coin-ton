"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTuple = exports.serializeTuple = void 0;
const Builder_1 = require("../boc/Builder");
const INT64_MIN = BigInt('-9223372036854775808');
const INT64_MAX = BigInt('9223372036854775807');
function serializeTupleItem(src, builder) {
    if (src.type === 'null') {
        builder.storeUint(0x00, 8);
    }
    else if (src.type === 'int') {
        if (src.value <= INT64_MAX && src.value >= INT64_MIN) {
            builder.storeUint(0x01, 8);
            builder.storeInt(src.value, 64);
        }
        else {
            builder.storeUint(0x0100, 15);
            builder.storeInt(src.value, 257);
        }
    }
    else if (src.type === 'nan') {
        builder.storeInt(0x02ff, 16);
    }
    else if (src.type === 'cell') {
        builder.storeUint(0x03, 8);
        builder.storeRef(src.cell);
    }
    else if (src.type === 'slice') {
        builder.storeUint(0x04, 8);
        builder.storeUint(0, 10);
        builder.storeUint(src.cell.bits.length, 10);
        builder.storeUint(0, 3);
        builder.storeUint(src.cell.refs.length, 3);
        builder.storeRef(src.cell);
    }
    else if (src.type === 'builder') {
        builder.storeUint(0x05, 8);
        builder.storeRef(src.cell);
    }
    else if (src.type === 'tuple') {
        let head = null;
        let tail = null;
        for (let i = 0; i < src.items.length; i++) {
            let s = head;
            head = tail;
            tail = s;
            if (i > 1) {
                head = (0, Builder_1.beginCell)()
                    .storeRef(tail)
                    .storeRef(head)
                    .endCell();
            }
            let bc = (0, Builder_1.beginCell)();
            serializeTupleItem(src.items[i], bc);
            tail = bc.endCell();
        }
        builder.storeUint(0x07, 8);
        builder.storeUint(src.items.length, 16);
        if (head) {
            builder.storeRef(head);
        }
        if (tail) {
            builder.storeRef(tail);
        }
    }
    else {
        throw Error('Invalid value');
    }
}
function parseStackItem(cs) {
    let kind = cs.loadUint(8);
    if (kind === 0) {
        return { type: 'null' };
    }
    else if (kind === 1) {
        return { type: 'int', value: cs.loadIntBig(64) };
    }
    else if (kind === 2) {
        if (cs.loadUint(7) === 0) {
            return { type: 'int', value: cs.loadIntBig(257) };
        }
        else {
            cs.loadBit();
            return { type: 'nan' };
        }
    }
    else if (kind === 3) {
        return { type: 'cell', cell: cs.loadRef() };
    }
    else if (kind === 4) {
        let startBits = cs.loadUint(10);
        let endBits = cs.loadUint(10);
        let startRefs = cs.loadUint(3);
        let endRefs = cs.loadUint(3);
        let rs = cs.loadRef().beginParse();
        rs.skip(startBits);
        let dt = rs.loadBits(endBits - startBits);
        let builder = (0, Builder_1.beginCell)()
            .storeBits(dt);
        if (startRefs < endRefs) {
            for (let i = 0; i < startRefs; i++) {
                rs.loadRef();
            }
            for (let i = 0; i < endRefs - startRefs; i++) {
                builder.storeRef(rs.loadRef());
            }
        }
        return { type: 'slice', cell: builder.endCell() };
    }
    else if (kind === 5) {
        return { type: 'builder', cell: cs.loadRef() };
    }
    else if (kind === 7) {
        let length = cs.loadUint(16);
        let items = [];
        if (length > 1) {
            let head = cs.loadRef().beginParse();
            let tail = cs.loadRef().beginParse();
            items.unshift(parseStackItem(tail));
            for (let i = 0; i < length - 2; i++) {
                let ohead = head;
                head = ohead.loadRef().beginParse();
                tail = ohead.loadRef().beginParse();
                items.unshift(parseStackItem(tail));
            }
            items.unshift(parseStackItem(head));
        }
        else if (length === 1) {
            items.push(parseStackItem(cs.loadRef().beginParse()));
        }
        return { type: 'tuple', items };
    }
    else {
        throw Error('Unsupported stack item');
    }
}
function serializeTupleTail(src, builder) {
    if (src.length > 0) {
        let tail = (0, Builder_1.beginCell)();
        serializeTupleTail(src.slice(0, src.length - 1), tail);
        builder.storeRef(tail.endCell());
        serializeTupleItem(src[src.length - 1], builder);
    }
}
function serializeTuple(src) {
    let builder = (0, Builder_1.beginCell)();
    builder.storeUint(src.length, 24);
    let r = [...src];
    serializeTupleTail(r, builder);
    return builder.endCell();
}
exports.serializeTuple = serializeTuple;
function parseTuple(src) {
    let res = [];
    let cs = src.beginParse();
    let size = cs.loadUint(24);
    for (let i = 0; i < size; i++) {
        let next = cs.loadRef();
        res.unshift(parseStackItem(cs));
        cs = next.beginParse();
    }
    return res;
}
exports.parseTuple = parseTuple;
//# sourceMappingURL=tuple.js.map