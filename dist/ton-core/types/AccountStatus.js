"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeAccountStatus = exports.loadAccountStatus = void 0;
function loadAccountStatus(slice) {
    const status = slice.loadUint(2);
    if (status === 0x00) {
        return 'uninitialized';
    }
    if (status === 0x01) {
        return 'frozen';
    }
    if (status === 0x02) {
        return 'active';
    }
    if (status === 0x03) {
        return 'non-existing';
    }
    throw Error('Invalid data');
}
exports.loadAccountStatus = loadAccountStatus;
function storeAccountStatus(src) {
    return (builder) => {
        if (src === 'uninitialized') {
            builder.storeUint(0x00, 2);
        }
        else if (src === 'frozen') {
            builder.storeUint(0x01, 2);
        }
        else if (src === 'active') {
            builder.storeUint(0x02, 2);
        }
        else if (src === 'non-existing') {
            builder.storeUint(0x03, 2);
        }
        else {
            throw Error('Invalid data');
        }
        return builder;
    };
}
exports.storeAccountStatus = storeAccountStatus;
//# sourceMappingURL=AccountStatus.js.map