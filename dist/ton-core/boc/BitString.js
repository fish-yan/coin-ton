"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitString = void 0;
const paddedBits_1 = require("./utils/paddedBits");
const symbol_inspect_1 = __importDefault(require("symbol.inspect"));
class BitString {
    static isBitString(src) {
        return src instanceof BitString;
    }
    constructor(data, offset, length) {
        this[_a] = () => this.toString();
        if (length < 0) {
            throw new Error(`Length ${length} is out of bounds`);
        }
        this._length = length;
        this._data = data;
        this._offset = offset;
    }
    get length() {
        return this._length;
    }
    at(index) {
        if (index >= this._length) {
            throw new Error(`Index ${index} > ${this._length} is out of bounds`);
        }
        if (index < 0) {
            throw new Error(`Index ${index} < 0 is out of bounds`);
        }
        let byteIndex = (this._offset + index) >> 3;
        let bitIndex = 7 - ((this._offset + index) % 8);
        return (this._data[byteIndex] & (1 << bitIndex)) !== 0;
    }
    substring(offset, length) {
        if (offset > this._length) {
            throw new Error(`Offset(${offset}) > ${this._length} is out of bounds`);
        }
        if (offset < 0) {
            throw new Error(`Offset(${offset}) < 0 is out of bounds`);
        }
        if (length === 0) {
            return BitString.EMPTY;
        }
        if (offset + length > this._length) {
            throw new Error(`Offset ${offset} + Length ${length} > ${this._length} is out of bounds`);
        }
        return new BitString(this._data, this._offset + offset, length);
    }
    subbuffer(offset, length) {
        if (offset > this._length) {
            throw new Error(`Offset ${offset} is out of bounds`);
        }
        if (offset < 0) {
            throw new Error(`Offset ${offset} is out of bounds`);
        }
        if (offset + length > this._length) {
            throw new Error(`Offset + Lenght = ${offset + length} is out of bounds`);
        }
        if (length % 8 !== 0) {
            return null;
        }
        if ((this._offset + offset) % 8 !== 0) {
            return null;
        }
        let start = ((this._offset + offset) >> 3);
        let end = start + (length >> 3);
        return this._data.subarray(start, end);
    }
    equals(b) {
        if (this._length !== b._length) {
            return false;
        }
        for (let i = 0; i < this._length; i++) {
            if (this.at(i) !== b.at(i)) {
                return false;
            }
        }
        return true;
    }
    toString() {
        const padded = (0, paddedBits_1.bitsToPaddedBuffer)(this);
        if (this._length % 4 === 0) {
            const s = padded.subarray(0, Math.ceil(this._length / 8)).toString('hex').toUpperCase();
            if (this._length % 8 === 0) {
                return s;
            }
            else {
                return s.substring(0, s.length - 1);
            }
        }
        else {
            const hex = padded.toString('hex').toUpperCase();
            if (this._length % 8 <= 4) {
                return hex.substring(0, hex.length - 1) + '_';
            }
            else {
                return hex + '_';
            }
        }
    }
}
exports.BitString = BitString;
_a = symbol_inspect_1.default;
BitString.EMPTY = new BitString(Buffer.alloc(0), 0, 0);
//# sourceMappingURL=BitString.js.map