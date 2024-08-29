"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slice = void 0;
const symbol_inspect_1 = __importDefault(require("symbol.inspect"));
const Dictionary_1 = require("../dict/Dictionary");
const Builder_1 = require("./Builder");
const strings_1 = require("./utils/strings");
class Slice {
    constructor(reader, refs) {
        this[_a] = () => this.toString();
        this._reader = reader.clone();
        this._refs = [...refs];
        this._refsOffset = 0;
    }
    get remainingBits() {
        return this._reader.remaining;
    }
    get offsetBits() {
        return this._reader.offset;
    }
    get remainingRefs() {
        return this._refs.length - this._refsOffset;
    }
    get offsetRefs() {
        return this._refsOffset;
    }
    skip(bits) {
        this._reader.skip(bits);
        return this;
    }
    loadBit() {
        return this._reader.loadBit();
    }
    preloadBit() {
        return this._reader.preloadBit();
    }
    loadBoolean() {
        return this.loadBit();
    }
    loadMaybeBoolean() {
        if (this.loadBit()) {
            return this.loadBoolean();
        }
        else {
            return null;
        }
    }
    loadBits(bits) {
        return this._reader.loadBits(bits);
    }
    preloadBits(bits) {
        return this._reader.preloadBits(bits);
    }
    loadUint(bits) {
        return this._reader.loadUint(bits);
    }
    loadUintBig(bits) {
        return this._reader.loadUintBig(bits);
    }
    preloadUint(bits) {
        return this._reader.preloadUint(bits);
    }
    preloadUintBig(bits) {
        return this._reader.preloadUintBig(bits);
    }
    loadMaybeUint(bits) {
        if (this.loadBit()) {
            return this.loadUint(bits);
        }
        else {
            return null;
        }
    }
    loadMaybeUintBig(bits) {
        if (this.loadBit()) {
            return this.loadUintBig(bits);
        }
        else {
            return null;
        }
    }
    loadInt(bits) {
        return this._reader.loadInt(bits);
    }
    loadIntBig(bits) {
        return this._reader.loadIntBig(bits);
    }
    preloadInt(bits) {
        return this._reader.preloadInt(bits);
    }
    preloadIntBig(bits) {
        return this._reader.preloadIntBig(bits);
    }
    loadMaybeInt(bits) {
        if (this.loadBit()) {
            return this.loadInt(bits);
        }
        else {
            return null;
        }
    }
    loadMaybeIntBig(bits) {
        if (this.loadBit()) {
            return this.loadIntBig(bits);
        }
        else {
            return null;
        }
    }
    loadVarUint(bits) {
        return this._reader.loadVarUint(bits);
    }
    loadVarUintBig(bits) {
        return this._reader.loadVarUintBig(bits);
    }
    preloadVarUint(bits) {
        return this._reader.preloadVarUint(bits);
    }
    preloadVarUintBig(bits) {
        return this._reader.preloadVarUintBig(bits);
    }
    loadVarInt(bits) {
        return this._reader.loadVarInt(bits);
    }
    loadVarIntBig(bits) {
        return this._reader.loadVarIntBig(bits);
    }
    preloadVarInt(bits) {
        return this._reader.preloadVarInt(bits);
    }
    preloadVarIntBig(bits) {
        return this._reader.preloadVarIntBig(bits);
    }
    loadCoins() {
        return this._reader.loadCoins();
    }
    preloadCoins() {
        return this._reader.preloadCoins();
    }
    loadMaybeCoins() {
        if (this._reader.loadBit()) {
            return this._reader.loadCoins();
        }
        else {
            return null;
        }
    }
    loadAddress() {
        return this._reader.loadAddress();
    }
    loadMaybeAddress() {
        return this._reader.loadMaybeAddress();
    }
    loadExternalAddress() {
        return this._reader.loadExternalAddress();
    }
    loadMaybeExternalAddress() {
        return this._reader.loadMaybeExternalAddress();
    }
    loadAddressAny() {
        return this._reader.loadAddressAny();
    }
    loadRef() {
        if (this._refsOffset >= this._refs.length) {
            throw new Error("No more references");
        }
        return this._refs[this._refsOffset++];
    }
    preloadRef() {
        if (this._refsOffset >= this._refs.length) {
            throw new Error("No more references");
        }
        return this._refs[this._refsOffset];
    }
    loadMaybeRef() {
        if (this.loadBit()) {
            return this.loadRef();
        }
        else {
            return null;
        }
    }
    preloadMaybeRef() {
        if (this.preloadBit()) {
            return this.preloadRef();
        }
        else {
            return null;
        }
    }
    loadBuffer(bytes) {
        return this._reader.loadBuffer(bytes);
    }
    preloadBuffer(bytes) {
        return this._reader.preloadBuffer(bytes);
    }
    loadStringTail() {
        return (0, strings_1.readString)(this);
    }
    loadMaybeStringTail() {
        if (this.loadBit()) {
            return (0, strings_1.readString)(this);
        }
        else {
            return null;
        }
    }
    loadStringRefTail() {
        return (0, strings_1.readString)(this.loadRef().beginParse());
    }
    loadMaybeStringRefTail() {
        const ref = this.loadMaybeRef();
        if (ref) {
            return (0, strings_1.readString)(ref.beginParse());
        }
        else {
            return null;
        }
    }
    loadDict(key, value) {
        return Dictionary_1.Dictionary.load(key, value, this);
    }
    loadDictDirect(key, value) {
        return Dictionary_1.Dictionary.loadDirect(key, value, this);
    }
    endParse() {
        if (this.remainingBits > 0 || this.remainingRefs > 0) {
            throw new Error("Slice is not empty");
        }
    }
    asCell() {
        return (0, Builder_1.beginCell)().storeSlice(this).endCell();
    }
    asBuilder() {
        return (0, Builder_1.beginCell)().storeSlice(this);
    }
    clone(fromStart = false) {
        if (fromStart) {
            let reader = this._reader.clone();
            reader.reset();
            return new Slice(reader, this._refs);
        }
        else {
            let res = new Slice(this._reader, this._refs);
            res._refsOffset = this._refsOffset;
            return res;
        }
    }
    toString() {
        return this.asCell().toString();
    }
}
exports.Slice = Slice;
_a = symbol_inspect_1.default;
//# sourceMappingURL=Slice.js.map