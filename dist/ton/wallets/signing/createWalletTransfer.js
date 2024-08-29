"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletTransferV5R1 = exports.createWalletTransferV4 = exports.createWalletTransferV3 = exports.createWalletTransferV2 = exports.createWalletTransferV1 = void 0;
const ton_core_1 = require("../../../ton-core");
const ton_crypto_1 = require("../../../ton-crypto");
const WalletContractV5_1 = require("../v5r1/WalletContractV5");
const WalletV5R1Actions_1 = require("../v5r1/WalletV5R1Actions");
const signer_1 = require("./signer");
function packSignatureToFront(signature, signingMessage) {
    const body = (0, ton_core_1.beginCell)()
        .storeBuffer(signature)
        .storeBuilder(signingMessage)
        .endCell();
    return body;
}
function packSignatureToTail(signature, signingMessage) {
    const body = (0, ton_core_1.beginCell)()
        .storeBuilder(signingMessage)
        .storeBuffer(signature)
        .endCell();
    return body;
}
function createWalletTransferV1(args) {
    let signingMessage = (0, ton_core_1.beginCell)()
        .storeUint(args.seqno, 32);
    if (args.message) {
        signingMessage.storeUint(args.sendMode, 8);
        signingMessage.storeRef((0, ton_core_1.beginCell)().store((0, ton_core_1.storeMessageRelaxed)(args.message)));
    }
    let signature = (0, ton_crypto_1.sign)(signingMessage.endCell().hash(), args.secretKey);
    const body = (0, ton_core_1.beginCell)()
        .storeBuffer(signature)
        .storeBuilder(signingMessage)
        .endCell();
    return body;
}
exports.createWalletTransferV1 = createWalletTransferV1;
function createWalletTransferV2(args) {
    if (args.messages.length > 4) {
        throw Error("Maximum number of messages in a single transfer is 4");
    }
    let signingMessage = (0, ton_core_1.beginCell)()
        .storeUint(args.seqno, 32);
    if (args.seqno === 0) {
        for (let i = 0; i < 32; i++) {
            signingMessage.storeBit(1);
        }
    }
    else {
        signingMessage.storeUint(args.timeout || Math.floor(Date.now() / 1e3) + 60, 32);
    }
    for (let m of args.messages) {
        signingMessage.storeUint(args.sendMode, 8);
        signingMessage.storeRef((0, ton_core_1.beginCell)().store((0, ton_core_1.storeMessageRelaxed)(m)));
    }
    let signature = (0, ton_crypto_1.sign)(signingMessage.endCell().hash(), args.secretKey);
    const body = (0, ton_core_1.beginCell)()
        .storeBuffer(signature)
        .storeBuilder(signingMessage)
        .endCell();
    return body;
}
exports.createWalletTransferV2 = createWalletTransferV2;
function createWalletTransferV3(args) {
    if (args.messages.length > 4) {
        throw Error("Maximum number of messages in a single transfer is 4");
    }
    let signingMessage = (0, ton_core_1.beginCell)()
        .storeUint(args.walletId, 32);
    if (args.seqno === 0) {
        for (let i = 0; i < 32; i++) {
            signingMessage.storeBit(1);
        }
    }
    else {
        signingMessage.storeUint(args.timeout || Math.floor(Date.now() / 1e3) + 60, 32);
    }
    signingMessage.storeUint(args.seqno, 32);
    for (let m of args.messages) {
        signingMessage.storeUint(args.sendMode, 8);
        signingMessage.storeRef((0, ton_core_1.beginCell)().store((0, ton_core_1.storeMessageRelaxed)(m)));
    }
    let signature = (0, ton_crypto_1.sign)(signingMessage.endCell().hash(), args.secretKey);
    const body = (0, ton_core_1.beginCell)()
        .storeBuffer(signature)
        .storeBuilder(signingMessage)
        .endCell();
    return body;
}
exports.createWalletTransferV3 = createWalletTransferV3;
function createWalletTransferV4(args) {
    if (args.messages.length > 4) {
        throw Error("Maximum number of messages in a single transfer is 4");
    }
    let signingMessage = (0, ton_core_1.beginCell)()
        .storeUint(args.walletId, 32);
    if (args.seqno === 0) {
        for (let i = 0; i < 32; i++) {
            signingMessage.storeBit(1);
        }
    }
    else {
        signingMessage.storeUint(args.timeout || Math.floor(Date.now() / 1e3) + 600, 32);
    }
    signingMessage.storeUint(args.seqno, 32);
    signingMessage.storeUint(0, 8);
    for (let m of args.messages) {
        signingMessage.storeUint(args.sendMode, 8);
        signingMessage.storeRef((0, ton_core_1.beginCell)().store((0, ton_core_1.storeMessageRelaxed)(m)));
    }
    let signature = (0, ton_crypto_1.sign)(signingMessage.endCell().hash(), args.secretKey);
    const body = (0, ton_core_1.beginCell)()
        .storeBuffer(signature)
        .storeBuilder(signingMessage)
        .endCell();
    return body;
}
exports.createWalletTransferV4 = createWalletTransferV4;
function createWalletTransferV5R1(args) {
    if (args.actions.length > 255) {
        throw Error("Maximum number of OutActions in a single request is 255");
    }
    args = { ...args };
    if (args.authType === 'extension') {
        return (0, ton_core_1.beginCell)()
            .storeUint(WalletContractV5_1.WalletContractV5R1.OpCodes.auth_extension, 32)
            .storeUint(args.queryId ?? 0, 64)
            .store((0, WalletV5R1Actions_1.storeOutListExtendedV5R1)(args.actions))
            .endCell();
    }
    args.actions = (0, WalletV5R1Actions_1.patchV5R1ActionsSendMode)(args.actions, args.authType);
    const signingMessage = (0, ton_core_1.beginCell)()
        .storeUint(args.authType === 'internal'
        ? WalletContractV5_1.WalletContractV5R1.OpCodes.auth_signed_internal
        : WalletContractV5_1.WalletContractV5R1.OpCodes.auth_signed_external, 32)
        .store(args.walletId);
    if (args.seqno === 0) {
        for (let i = 0; i < 32; i++) {
            signingMessage.storeBit(1);
        }
    }
    else {
        signingMessage.storeUint(args.timeout || Math.floor(Date.now() / 1e3) + 60, 32);
    }
    signingMessage
        .storeUint(args.seqno, 32)
        .store((0, WalletV5R1Actions_1.storeOutListExtendedV5R1)(args.actions));
    return (0, signer_1.signPayload)(args, signingMessage, packSignatureToTail);
}
exports.createWalletTransferV5R1 = createWalletTransferV5R1;
//# sourceMappingURL=createWalletTransfer.js.map