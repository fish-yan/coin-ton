"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paddedBufferToBits = exports.bitsToPaddedBuffer = void 0;
const BitBuilder_1 = require("../BitBuilder");
const BitString_1 = require("../BitString");
function bitsToPaddedBuffer(bits) {
    let builder = new BitBuilder_1.BitBuilder(Math.ceil(bits.length / 8) * 8);
    builder.writeBits(bits);
    let padding = Math.ceil(bits.length / 8) * 8 - bits.length;
    for (let i = 0; i < padding; i++) {
        if (i === 0) {
            builder.writeBit(1);
        }
        else {
            builder.writeBit(0);
        }
    }
    return builder.buffer();
}
exports.bitsToPaddedBuffer = bitsToPaddedBuffer;
function paddedBufferToBits(buff) {
    let bitLen = 0;
    for (let i = buff.length - 1; i >= 0; i--) {
        if (buff[i] !== 0) {
            const testByte = buff[i];
            let bitPos = testByte & -testByte;
            if ((bitPos & 1) == 0) {
                bitPos = Math.log2(bitPos) + 1;
            }
            if (i > 0) {
                bitLen = i << 3;
            }
            bitLen += 8 - bitPos;
            break;
        }
    }
    return new BitString_1.BitString(buff, 0, bitLen);
}
exports.paddedBufferToBits = paddedBufferToBits;
//# sourceMappingURL=paddedBits.js.map