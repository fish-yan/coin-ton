"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = exports.beginCell = void 0;
const BitBuilder_1 = require("./BitBuilder");
const Cell_1 = require("./Cell");
const strings_1 = require("./utils/strings");
function beginCell() {
    return new Builder();
}
exports.beginCell = beginCell;
class Builder {
    constructor() {
        this._bits = new BitBuilder_1.BitBuilder();
        this._refs = [];
    }
    get bits() {
        return this._bits.length;
    }
    get refs() {
        return this._refs.length;
    }
    get availableBits() {
        return 1023 - this.bits;
    }
    get availableRefs() {
        return 4 - this.refs;
    }
    storeBit(value) {
        this._bits.writeBit(value);
        return this;
    }
    storeBits(src) {
        this._bits.writeBits(src);
        return this;
    }
    storeBuffer(src, bytes) {
        if (bytes !== undefined && bytes !== null) {
            if (src.length !== bytes) {
                throw Error(`Buffer length ${src.length} is not equal to ${bytes}`);
            }
        }
        this._bits.writeBuffer(src);
        return this;
    }
    storeMaybeBuffer(src, bytes) {
        if (src !== null) {
            this.storeBit(1);
            this.storeBuffer(src, bytes);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    storeUint(value, bits) {
        this._bits.writeUint(value, bits);
        return this;
    }
    storeMaybeUint(value, bits) {
        if (value !== null && value !== undefined) {
            this.storeBit(1);
            this.storeUint(value, bits);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    storeInt(value, bits) {
        this._bits.writeInt(value, bits);
        return this;
    }
    storeMaybeInt(value, bits) {
        if (value !== null && value !== undefined) {
            this.storeBit(1);
            this.storeInt(value, bits);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    storeVarUint(value, bits) {
        this._bits.writeVarUint(value, bits);
        return this;
    }
    storeMaybeVarUint(value, bits) {
        if (value !== null && value !== undefined) {
            this.storeBit(1);
            this.storeVarUint(value, bits);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    storeVarInt(value, bits) {
        this._bits.writeVarInt(value, bits);
        return this;
    }
    storeMaybeVarInt(value, bits) {
        if (value !== null && value !== undefined) {
            this.storeBit(1);
            this.storeVarInt(value, bits);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    storeCoins(amount) {
        this._bits.writeCoins(amount);
        return this;
    }
    storeMaybeCoins(amount) {
        if (amount !== null && amount !== undefined) {
            this.storeBit(1);
            this.storeCoins(amount);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    storeAddress(address) {
        this._bits.writeAddress(address);
        return this;
    }
    storeRef(cell) {
        if (this._refs.length >= 4) {
            throw new Error("Too many references");
        }
        if (cell instanceof Cell_1.Cell) {
            this._refs.push(cell);
        }
        else if (cell instanceof Builder) {
            this._refs.push(cell.endCell());
        }
        else {
            throw new Error("Invalid argument");
        }
        return this;
    }
    storeMaybeRef(cell) {
        if (cell) {
            this.storeBit(1);
            this.storeRef(cell);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    storeSlice(src) {
        let c = src.clone();
        if (c.remainingBits > 0) {
            this.storeBits(c.loadBits(c.remainingBits));
        }
        while (c.remainingRefs > 0) {
            this.storeRef(c.loadRef());
        }
        return this;
    }
    storeMaybeSlice(src) {
        if (src) {
            this.storeBit(1);
            this.storeSlice(src);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    storeBuilder(src) {
        return this.storeSlice(src.endCell().beginParse());
    }
    storeMaybeBuilder(src) {
        if (src) {
            this.storeBit(1);
            this.storeBuilder(src);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    storeWritable(writer) {
        if (typeof writer === 'object') {
            writer.writeTo(this);
        }
        else {
            writer(this);
        }
        return this;
    }
    storeMaybeWritable(writer) {
        if (writer) {
            this.storeBit(1);
            this.storeWritable(writer);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    store(writer) {
        this.storeWritable(writer);
        return this;
    }
    storeStringTail(src) {
        (0, strings_1.writeString)(src, this);
        return this;
    }
    storeMaybeStringTail(src) {
        if (src !== null && src !== undefined) {
            this.storeBit(1);
            (0, strings_1.writeString)(src, this);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    storeStringRefTail(src) {
        this.storeRef(beginCell()
            .storeStringTail(src));
        return this;
    }
    storeMaybeStringRefTail(src) {
        if (src !== null && src !== undefined) {
            this.storeBit(1);
            this.storeStringRefTail(src);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    storeDict(dict, key, value) {
        if (dict) {
            dict.store(this, key, value);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    storeDictDirect(dict, key, value) {
        dict.storeDirect(this, key, value);
        return this;
    }
    endCell(opts) {
        return new Cell_1.Cell({
            bits: this._bits.build(),
            refs: this._refs,
            exotic: opts?.exotic
        });
    }
    asCell() {
        return this.endCell();
    }
    asSlice() {
        return this.endCell().beginParse();
    }
}
exports.Builder = Builder;
//# sourceMappingURL=Builder.js.map