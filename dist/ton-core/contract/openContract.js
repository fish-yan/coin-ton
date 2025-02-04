"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openContract = void 0;
const Address_1 = require("../address/Address");
const Cell_1 = require("../boc/Cell");
function openContract(src, factory) {
    let address;
    let init = null;
    if (!Address_1.Address.isAddress(src.address)) {
        throw Error('Invalid address');
    }
    address = src.address;
    if (src.init) {
        if (!(src.init.code instanceof Cell_1.Cell)) {
            throw Error('Invalid init.code');
        }
        if (!(src.init.data instanceof Cell_1.Cell)) {
            throw Error('Invalid init.data');
        }
        init = src.init;
    }
    let executor = factory({ address, init });
    return new Proxy(src, {
        get(target, prop) {
            const value = target[prop];
            if (typeof prop === 'string' && (prop.startsWith('get') || prop.startsWith('send'))) {
                if (typeof value === 'function') {
                    return (...args) => value.apply(target, [executor, ...args]);
                }
            }
            return value;
        }
    });
}
exports.openContract = openContract;
//# sourceMappingURL=openContract.js.map