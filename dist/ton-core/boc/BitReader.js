"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitReader = void 0;
const Address_1 = require("../address/Address");
const ExternalAddress_1 = require("../address/ExternalAddress");
class BitReader {
    constructor(bits, offset = 0) {
        this._checkpoints = [];
        this._bits = bits;
        this._offset = offset;
    }
    get offset() {
        return this._offset;
    }
    get remaining() {
        return this._bits.length - this._offset;
    }
    skip(bits) {
        if (bits < 0 || this._offset + bits > this._bits.length) {
            throw new Error(`Index ${this._offset + bits} is out of bounds`);
        }
        this._offset += bits;
    }
    reset() {
        if (this._checkpoints.length > 0) {
            this._offset = this._checkpoints.pop();
        }
        else {
            this._offset = 0;
        }
    }
    save() {
        this._checkpoints.push(this._offset);
    }
    loadBit() {
        let r = this._bits.at(this._offset);
        this._offset++;
        return r;
    }
    preloadBit() {
        return this._bits.at(this._offset);
    }
    loadBits(bits) {
        let r = this._bits.substring(this._offset, bits);
        this._offset += bits;
        return r;
    }
    preloadBits(bits) {
        return this._bits.substring(this._offset, bits);
    }
    loadBuffer(bytes) {
        let buf = this._preloadBuffer(bytes, this._offset);
        this._offset += bytes * 8;
        return buf;
    }
    preloadBuffer(bytes) {
        return this._preloadBuffer(bytes, this._offset);
    }
    loadUint(bits) {
        return Number(this.loadUintBig(bits));
    }
    loadUintBig(bits) {
        let loaded = this.preloadUintBig(bits);
        this._offset += bits;
        return loaded;
    }
    preloadUint(bits) {
        return Number(this._preloadUint(bits, this._offset));
    }
    preloadUintBig(bits) {
        return this._preloadUint(bits, this._offset);
    }
    loadInt(bits) {
        let res = this._preloadInt(bits, this._offset);
        this._offset += bits;
        return Number(res);
    }
    loadIntBig(bits) {
        let res = this._preloadInt(bits, this._offset);
        this._offset += bits;
        return res;
    }
    preloadInt(bits) {
        return Number(this._preloadInt(bits, this._offset));
    }
    preloadIntBig(bits) {
        return this._preloadInt(bits, this._offset);
    }
    loadVarUint(bits) {
        let size = Number(this.loadUint(bits));
        return Number(this.loadUintBig(size * 8));
    }
    loadVarUintBig(bits) {
        let size = Number(this.loadUint(bits));
        return this.loadUintBig(size * 8);
    }
    preloadVarUint(bits) {
        let size = Number(this._preloadUint(bits, this._offset));
        return Number(this._preloadUint(size * 8, this._offset + bits));
    }
    preloadVarUintBig(bits) {
        let size = Number(this._preloadUint(bits, this._offset));
        return this._preloadUint(size * 8, this._offset + bits);
    }
    loadVarInt(bits) {
        let size = Number(this.loadUint(bits));
        return Number(this.loadIntBig(size * 8));
    }
    loadVarIntBig(bits) {
        let size = Number(this.loadUint(bits));
        return this.loadIntBig(size * 8);
    }
    preloadVarInt(bits) {
        let size = Number(this._preloadUint(bits, this._offset));
        return Number(this._preloadInt(size * 8, this._offset + bits));
    }
    preloadVarIntBig(bits) {
        let size = Number(this._preloadUint(bits, this._offset));
        return this._preloadInt(size * 8, this._offset + bits);
    }
    loadCoins() {
        return this.loadVarUintBig(4);
    }
    preloadCoins() {
        return this.preloadVarUintBig(4);
    }
    loadAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 2) {
            return this._loadInternalAddress();
        }
        else {
            throw new Error("Invalid address: " + type);
        }
    }
    loadMaybeAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 0) {
            this._offset += 2;
            return null;
        }
        else if (type === 2) {
            return this._loadInternalAddress();
        }
        else {
            throw new Error("Invalid address");
        }
    }
    loadExternalAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 1) {
            return this._loadExternalAddress();
        }
        else {
            throw new Error("Invalid address");
        }
    }
    loadMaybeExternalAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 0) {
            this._offset += 2;
            return null;
        }
        else if (type === 1) {
            return this._loadExternalAddress();
        }
        else {
            throw new Error("Invalid address");
        }
    }
    loadAddressAny() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 0) {
            this._offset += 2;
            return null;
        }
        else if (type === 2) {
            return this._loadInternalAddress();
        }
        else if (type === 1) {
            return this._loadExternalAddress();
        }
        else if (type === 3) {
            throw Error('Unsupported');
        }
        else {
            throw Error('Unreachable');
        }
    }
    loadPaddedBits(bits) {
        if (bits % 8 !== 0) {
            throw new Error("Invalid number of bits");
        }
        let length = bits;
        while (true) {
            if (this._bits.at(this._offset + length - 1)) {
                length--;
                break;
            }
            else {
                length--;
            }
        }
        let r = this._bits.substring(this._offset, length);
        this._offset += bits;
        return r;
    }
    clone() {
        return new BitReader(this._bits, this._offset);
    }
    _preloadInt(bits, offset) {
        if (bits == 0) {
            return 0n;
        }
        let sign = this._bits.at(offset);
        let res = 0n;
        for (let i = 0; i < bits - 1; i++) {
            if (this._bits.at(offset + 1 + i)) {
                res += 1n << BigInt(bits - i - 1 - 1);
            }
        }
        if (sign) {
            res = res - (1n << BigInt(bits - 1));
        }
        return res;
    }
    _preloadUint(bits, offset) {
        if (bits == 0) {
            return 0n;
        }
        let res = 0n;
        for (let i = 0; i < bits; i++) {
            if (this._bits.at(offset + i)) {
                res += 1n << BigInt(bits - i - 1);
            }
        }
        return res;
    }
    _preloadBuffer(bytes, offset) {
        let fastBuffer = this._bits.subbuffer(offset, bytes * 8);
        if (fastBuffer) {
            return fastBuffer;
        }
        let buf = Buffer.alloc(bytes);
        for (let i = 0; i < bytes; i++) {
            buf[i] = Number(this._preloadUint(8, offset + i * 8));
        }
        return buf;
    }
    _loadInternalAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type !== 2) {
            throw Error('Invalid address');
        }
        if (this._preloadUint(1, this._offset + 2) !== 0n) {
            throw Error('Invalid address');
        }
        let wc = Number(this._preloadInt(8, this._offset + 3));
        let hash = this._preloadBuffer(32, this._offset + 11);
        this._offset += 267;
        return new Address_1.Address(wc, hash);
    }
    _loadExternalAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type !== 1) {
            throw Error('Invalid address');
        }
        let bits = Number(this._preloadUint(9, this._offset + 2));
        let value = this._preloadUint(bits, this._offset + 11);
        this._offset += 11 + bits;
        return new ExternalAddress_1.ExternalAddress(value, bits);
    }
}
exports.BitReader = BitReader;
//# sourceMappingURL=BitReader.js.map