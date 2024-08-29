"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitBuilder = void 0;
const Address_1 = require("../address/Address");
const ExternalAddress_1 = require("../address/ExternalAddress");
const BitString_1 = require("./BitString");
class BitBuilder {
    constructor(size = 1023) {
        this._buffer = Buffer.alloc(Math.ceil(size / 8));
        this._length = 0;
    }
    get length() {
        return this._length;
    }
    writeBit(value) {
        let n = this._length;
        if (n > this._buffer.length * 8) {
            throw new Error("BitBuilder overflow");
        }
        if ((typeof value === 'boolean' && value === true) || (typeof value === 'number' && value > 0)) {
            this._buffer[(n / 8) | 0] |= 1 << (7 - (n % 8));
        }
        this._length++;
    }
    writeBits(src) {
        for (let i = 0; i < src.length; i++) {
            this.writeBit(src.at(i));
        }
    }
    writeBuffer(src) {
        if (this._length % 8 === 0) {
            if (this._length + src.length * 8 > this._buffer.length * 8) {
                throw new Error("BitBuilder overflow");
            }
            src.copy(this._buffer, this._length / 8);
            this._length += src.length * 8;
        }
        else {
            for (let i = 0; i < src.length; i++) {
                this.writeUint(src[i], 8);
            }
        }
    }
    writeUint(value, bits) {
        if (bits < 0 || !Number.isSafeInteger(bits)) {
            throw Error(`invalid bit length. Got ${bits}`);
        }
        const v = BigInt(value);
        if (bits === 0) {
            if (v !== 0n) {
                throw Error(`value is not zero for ${bits} bits. Got ${value}`);
            }
            else {
                return;
            }
        }
        const vBits = (1n << BigInt(bits));
        if (v < 0 || v >= vBits) {
            throw Error(`bitLength is too small for a value ${value}. Got ${bits}`);
        }
        if (this._length + bits > this._buffer.length * 8) {
            throw new Error("BitBuilder overflow");
        }
        const tillByte = 8 - (this._length % 8);
        if (tillByte > 0) {
            const bidx = Math.floor(this._length / 8);
            if (bits < tillByte) {
                const wb = Number(v);
                this._buffer[bidx] |= wb << (tillByte - bits);
                this._length += bits;
            }
            else {
                const wb = Number(v >> BigInt(bits - tillByte));
                this._buffer[bidx] |= wb;
                this._length += tillByte;
            }
        }
        bits -= tillByte;
        while (bits > 0) {
            if (bits >= 8) {
                this._buffer[this._length / 8] = Number((v >> BigInt(bits - 8)) & 0xffn);
                this._length += 8;
                bits -= 8;
            }
            else {
                this._buffer[this._length / 8] = Number((v << BigInt(8 - bits)) & 0xffn);
                this._length += bits;
                bits = 0;
            }
        }
    }
    writeInt(value, bits) {
        let v = BigInt(value);
        if (bits < 0 || !Number.isSafeInteger(bits)) {
            throw Error(`invalid bit length. Got ${bits}`);
        }
        if (bits === 0) {
            if (value !== 0n) {
                throw Error(`value is not zero for ${bits} bits. Got ${value}`);
            }
            else {
                return;
            }
        }
        if (bits === 1) {
            if (value !== -1n && value !== 0n) {
                throw Error(`value is not zero or -1 for ${bits} bits. Got ${value}`);
            }
            else {
                this.writeBit(value === -1n);
                return;
            }
        }
        let vBits = 1n << (BigInt(bits) - 1n);
        if (v < -vBits || v >= vBits) {
            throw Error(`value is out of range for ${bits} bits. Got ${value}`);
        }
        if (v < 0) {
            this.writeBit(true);
            v = vBits + v;
        }
        else {
            this.writeBit(false);
        }
        this.writeUint(v, bits - 1);
    }
    writeVarUint(value, bits) {
        let v = BigInt(value);
        if (bits < 0 || !Number.isSafeInteger(bits)) {
            throw Error(`invalid bit length. Got ${bits}`);
        }
        if (v < 0) {
            throw Error(`value is negative. Got ${value}`);
        }
        if (v === 0n) {
            this.writeUint(0, bits);
            return;
        }
        const sizeBytes = Math.ceil((v.toString(2).length) / 8);
        const sizeBits = sizeBytes * 8;
        this.writeUint(sizeBytes, bits);
        this.writeUint(v, sizeBits);
    }
    writeVarInt(value, bits) {
        let v = BigInt(value);
        if (bits < 0 || !Number.isSafeInteger(bits)) {
            throw Error(`invalid bit length. Got ${bits}`);
        }
        if (v === 0n) {
            this.writeUint(0, bits);
            return;
        }
        let v2 = v > 0 ? v : -v;
        const sizeBytes = 1 + Math.ceil((v2.toString(2).length) / 8);
        const sizeBits = sizeBytes * 8;
        this.writeUint(sizeBytes, bits);
        this.writeInt(v, sizeBits);
    }
    writeCoins(amount) {
        this.writeVarUint(amount, 4);
    }
    writeAddress(address) {
        if (address === null || address === undefined) {
            this.writeUint(0, 2);
            return;
        }
        if (Address_1.Address.isAddress(address)) {
            this.writeUint(2, 2);
            this.writeUint(0, 1);
            this.writeInt(address.workChain, 8);
            this.writeBuffer(address.hash);
            return;
        }
        if (ExternalAddress_1.ExternalAddress.isAddress(address)) {
            this.writeUint(1, 2);
            this.writeUint(address.bits, 9);
            this.writeUint(address.value, address.bits);
            return;
        }
        throw Error(`Invalid address. Got ${address}`);
    }
    build() {
        return new BitString_1.BitString(this._buffer, 0, this._length);
    }
    buffer() {
        if (this._length % 8 !== 0) {
            throw new Error("BitBuilder buffer is not byte aligned");
        }
        return this._buffer.subarray(0, this._length / 8);
    }
}
exports.BitBuilder = BitBuilder;
//# sourceMappingURL=BitBuilder.js.map