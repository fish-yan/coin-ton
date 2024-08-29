"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDict = void 0;
function readUnaryLength(slice) {
    let res = 0;
    while (slice.loadBit()) {
        res++;
    }
    return res;
}
function doParse(prefix, slice, n, res, extractor) {
    let lb0 = slice.loadBit() ? 1 : 0;
    let prefixLength = 0;
    let pp = prefix;
    if (lb0 === 0) {
        prefixLength = readUnaryLength(slice);
        for (let i = 0; i < prefixLength; i++) {
            pp += slice.loadBit() ? '1' : '0';
        }
    }
    else {
        let lb1 = slice.loadBit() ? 1 : 0;
        if (lb1 === 0) {
            prefixLength = slice.loadUint(Math.ceil(Math.log2(n + 1)));
            for (let i = 0; i < prefixLength; i++) {
                pp += slice.loadBit() ? '1' : '0';
            }
        }
        else {
            let bit = slice.loadBit() ? '1' : '0';
            prefixLength = slice.loadUint(Math.ceil(Math.log2(n + 1)));
            for (let i = 0; i < prefixLength; i++) {
                pp += bit;
            }
        }
    }
    if (n - prefixLength === 0) {
        res.set(BigInt('0b' + pp), extractor(slice));
    }
    else {
        let left = slice.loadRef();
        let right = slice.loadRef();
        if (!left.isExotic) {
            doParse(pp + '0', left.beginParse(), n - prefixLength - 1, res, extractor);
        }
        if (!right.isExotic) {
            doParse(pp + '1', right.beginParse(), n - prefixLength - 1, res, extractor);
        }
    }
}
function parseDict(sc, keySize, extractor) {
    let res = new Map();
    if (sc) {
        doParse('', sc, keySize, res, extractor);
    }
    return res;
}
exports.parseDict = parseDict;
//# sourceMappingURL=parseDict.js.map