"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNftTransferPayload = exports.buildNotcoinVoucherExchange = exports.packBytesAsSnake = exports.commentToBytes = exports.OpCode = exports.NftOpCode = void 0;
const ton_core_1 = require("../ton-core");
const constant_1 = require("./constant");
const index_1 = require("./index");
var NftOpCode;
(function (NftOpCode) {
    NftOpCode[NftOpCode["TransferOwnership"] = 1607220500] = "TransferOwnership";
    NftOpCode[NftOpCode["OwnershipAssigned"] = 85167505] = "OwnershipAssigned";
})(NftOpCode = exports.NftOpCode || (exports.NftOpCode = {}));
var OpCode;
(function (OpCode) {
    OpCode[OpCode["Comment"] = 0] = "Comment";
    OpCode[OpCode["Encrypted"] = 560454219] = "Encrypted";
})(OpCode = exports.OpCode || (exports.OpCode = {}));
function commentToBytes(comment) {
    const buffer = Buffer.from(comment);
    const bytes = new Uint8Array(buffer.length + 4);
    const startBuffer = Buffer.alloc(4);
    startBuffer.writeUInt32BE(OpCode.Comment);
    bytes.set(startBuffer, 0);
    bytes.set(buffer, 4);
    return bytes;
}
exports.commentToBytes = commentToBytes;
const TON_MAX_COMMENT_BYTES = 127;
function packBytesAsSnake(bytes, maxBytes = TON_MAX_COMMENT_BYTES) {
    const buffer = Buffer.from(bytes);
    if (buffer.length <= maxBytes) {
        return bytes;
    }
    const mainBuilder = new ton_core_1.Builder();
    let prevBuilder;
    let currentBuilder = mainBuilder;
    for (const [i, byte] of buffer.entries()) {
        if (currentBuilder.availableBits < 8) {
            prevBuilder?.storeRef(currentBuilder);
            prevBuilder = currentBuilder;
            currentBuilder = new ton_core_1.Builder();
        }
        currentBuilder = currentBuilder.storeUint(byte, 8);
        if (i === buffer.length - 1) {
            prevBuilder?.storeRef(currentBuilder);
        }
    }
    return mainBuilder.asCell();
}
exports.packBytesAsSnake = packBytesAsSnake;
function buildNotcoinVoucherExchange(fromAddress, nftAddress, nftIndex) {
    const first4Bits = ton_core_1.Address.parse(nftAddress).hash.readUint8() >> 4;
    const toAddress = constant_1.NOTCOIN_EXCHANGERS[first4Bits];
    const payload = new ton_core_1.Builder()
        .storeUint(0x5fec6642, 32)
        .storeUint(nftIndex, 64)
        .endCell();
    return buildNftTransferPayload(fromAddress, toAddress, payload, constant_1.NOTCOIN_FORWARD_TON_AMOUNT);
}
exports.buildNotcoinVoucherExchange = buildNotcoinVoucherExchange;
function buildNftTransferPayload(fromAddress, toAddress, payload, forwardAmount = constant_1.NFT_TRANSFER_TONCOIN_FORWARD_AMOUNT) {
    let builder = new ton_core_1.Builder()
        .storeUint(NftOpCode.TransferOwnership, 32)
        .storeUint((0, index_1.generateQueryId)(), 64)
        .storeAddress(ton_core_1.Address.parse(toAddress))
        .storeAddress(ton_core_1.Address.parse(fromAddress))
        .storeBit(false)
        .storeCoins(forwardAmount);
    let forwardPayload;
    if (payload) {
        if (typeof payload === 'string') {
            const bytes = commentToBytes(payload);
            const freeBytes = Math.floor(builder.availableBits / 8);
            forwardPayload = packBytesAsSnake(bytes, freeBytes);
        }
        else {
            forwardPayload = payload;
        }
    }
    if (forwardPayload instanceof Uint8Array) {
        builder.storeBit(0);
        builder = builder.storeBuffer(Buffer.from(forwardPayload));
    }
    else {
        builder = builder.storeMaybeRef(forwardPayload);
    }
    return builder.endCell();
}
exports.buildNftTransferPayload = buildNftTransferPayload;
//# sourceMappingURL=nfts.js.map