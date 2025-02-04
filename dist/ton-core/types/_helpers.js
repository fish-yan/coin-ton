"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comment = exports.external = exports.internal = void 0;
const Address_1 = require("../address/Address");
const Cell_1 = require("../boc/Cell");
const Builder_1 = require("../boc/Builder");
const convert_1 = require("../utils/convert");
function internal(src) {
    let bounce = true;
    if (src.bounce !== null && src.bounce !== undefined) {
        bounce = src.bounce;
    }
    let to;
    if (typeof src.to === 'string') {
        to = Address_1.Address.parse(src.to);
    }
    else if (Address_1.Address.isAddress(src.to)) {
        to = src.to;
    }
    else {
        throw new Error(`Invalid address ${src.to}`);
    }
    let value;
    if (typeof src.value === 'string') {
        value = (0, convert_1.toNano)(src.value);
    }
    else {
        value = src.value;
    }
    let body = Cell_1.Cell.EMPTY;
    if (typeof src.body === 'string') {
        body = (0, Builder_1.beginCell)().storeUint(0, 32).storeStringTail(src.body).endCell();
    }
    else if (src.body) {
        body = src.body;
    }
    return {
        info: {
            type: 'internal',
            dest: to,
            value: { coins: value },
            bounce,
            ihrDisabled: true,
            bounced: false,
            ihrFee: 0n,
            forwardFee: 0n,
            createdAt: 0,
            createdLt: 0n
        },
        init: src.init ?? undefined,
        body: body
    };
}
exports.internal = internal;
function external(src) {
    let to;
    if (typeof src.to === 'string') {
        to = Address_1.Address.parse(src.to);
    }
    else if (Address_1.Address.isAddress(src.to)) {
        to = src.to;
    }
    else {
        throw new Error(`Invalid address ${src.to}`);
    }
    return {
        info: {
            type: 'external-in',
            dest: to,
            importFee: 0n
        },
        init: src.init ?? undefined,
        body: src.body || Cell_1.Cell.EMPTY
    };
}
exports.external = external;
function comment(src) {
    return (0, Builder_1.beginCell)()
        .storeUint(0, 32)
        .storeStringTail(src)
        .endCell();
}
exports.comment = comment;
//# sourceMappingURL=_helpers.js.map