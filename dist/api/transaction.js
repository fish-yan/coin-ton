"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signMultiTransaction = exports.jettonTransfer = exports.venomTransfer = exports.transfer = void 0;
const ton_1 = require("../ton");
const crypto_lib_1 = require("@okxweb3/crypto-lib");
const ton_core_1 = require("../ton-core");
const ton_core_2 = require("../ton-core");
const WalletContractV4_1 = require("../ton/wallets/WalletContractV4");
const address_1 = require("./address");
const index_1 = require("./index");
const constant_1 = require("./constant");
const WalletContractV5_1 = require("../ton/wallets/v5r1/WalletContractV5");
function transfer(txData, seed, walletVersion) {
    var secretK;
    var publicK;
    if (seed) {
        const { secretKey, publicKey } = crypto_lib_1.signUtil.ed25519.fromSeed(crypto_lib_1.base.fromHex(seed));
        secretK = secretKey;
        publicK = publicKey;
    }
    else {
        publicK = crypto_lib_1.base.fromHex(txData.publicKey);
    }
    const messages = [(0, ton_core_1.internal)({
            to: txData.to,
            value: BigInt(txData.amount),
            bounce: false,
            body: txData.memo
        })];
    let signedMessage;
    if (!walletVersion || walletVersion.toLowerCase() == "v5r1") {
        let wallet = WalletContractV5_1.WalletContractV5R1.create({ workchain: 0, publicKey: Buffer.from(publicK) });
        signedMessage = wallet.createTransfer({
            seqno: txData.seqno,
            messages,
            secretKey: seed ? Buffer.from(secretK) : Buffer.alloc(0),
            sendMode: txData.sendMode,
            timeout: txData.expireAt
        });
    }
    else if (walletVersion.toLowerCase() == "v4r2") {
        let wallet = WalletContractV4_1.WalletContractV4.create({ workchain: 0, publicKey: Buffer.from(publicK) });
        signedMessage = wallet.createTransfer({
            seqno: txData.seqno,
            messages,
            secretKey: seed ? Buffer.from(secretK) : Buffer.alloc(0),
            sendMode: txData.sendMode,
            timeout: txData.expireAt
        });
    }
    else {
    }
    return {
        boc: crypto_lib_1.base.toBase64(signedMessage.toBoc()),
    };
}
exports.transfer = transfer;
function venomTransfer(txData, seed) {
    const { secretKey, publicKey } = crypto_lib_1.signUtil.ed25519.fromSeed(crypto_lib_1.base.fromHex(seed));
    const wallet = ton_1.VenomWalletV3.create({ workchain: 0, publicKey: Buffer.from(publicKey) });
    const messages = [(0, ton_core_1.internal)({
            to: txData.to,
            value: BigInt(txData.amount),
            bounce: txData.toIsInit,
            body: txData.memo
        })];
    const signedMessage = wallet.createTransfer({
        seqno: txData.seqno,
        messages, secretKey: Buffer.from(secretKey),
        globalId: txData.globalId,
        sendMode: txData.sendMode,
        timeout: txData.expireAt,
    });
    return {
        id: crypto_lib_1.base.toBase64(signedMessage.hash()),
        body: crypto_lib_1.base.toBase64(signedMessage.toBoc()),
    };
}
exports.venomTransfer = venomTransfer;
function jettonTransfer(txData, seed, walletVersion) {
    var secretK;
    var publicK;
    if (seed) {
        const { secretKey, publicKey } = crypto_lib_1.signUtil.ed25519.fromSeed(crypto_lib_1.base.fromHex(seed));
        secretK = secretKey;
        publicK = publicKey;
    }
    else {
        publicK = crypto_lib_1.base.fromHex(txData.publicKey);
    }
    let wallet;
    if (!walletVersion || walletVersion.toLowerCase() == "v5r1") {
        wallet = WalletContractV5_1.WalletContractV5R1.create({ workchain: 0, publicKey: Buffer.from(publicK) });
    }
    else if (walletVersion.toLowerCase() == "v4r2") {
        wallet = WalletContractV4_1.WalletContractV4.create({ workchain: 0, publicKey: Buffer.from(publicK) });
    }
    else {
    }
    const responseAddr = wallet.address;
    const toAddr = ton_core_2.Address.parse(txData.to);
    const fromJettonWallet = ton_core_2.Address.parse(txData.fromJettonAccount);
    if (txData.decimal < 0) {
        throw new Error("invalid decimal");
    }
    const jettonAmount = BigInt(txData.amount);
    if (jettonAmount < 0) {
        throw new Error("invalid amount");
    }
    const queryId = txData.queryId ? BigInt(txData.queryId) : (0, index_1.generateQueryId)();
    let transferPayload;
    const messageBuild = (0, ton_core_2.beginCell)()
        .storeUint(0x0f8a7ea5, 32)
        .storeUint(queryId, 64)
        .storeCoins(BigInt(txData.amount))
        .storeAddress(toAddr)
        .storeAddress(responseAddr)
        .storeBit(false)
        .storeCoins(BigInt(txData.invokeNotificationFee || "1"));
    if (txData.memo) {
        const forwardPayload = (0, ton_core_2.beginCell)()
            .storeUint(0, 32)
            .storeStringTail(txData.memo)
            .endCell();
        transferPayload = messageBuild.storeBit(true)
            .storeRef(forwardPayload)
            .endCell();
    }
    else {
        transferPayload = messageBuild.storeBit(false).endCell();
    }
    const internalMessage = [(0, ton_core_1.internal)({
            to: fromJettonWallet,
            value: BigInt(txData.messageAttachedTons || "50000000"),
            body: transferPayload,
            bounce: false,
        })];
    let signedMessage;
    if (!walletVersion || walletVersion.toLowerCase() == "v5r1") {
        signedMessage = wallet.createTransfer({
            seqno: txData.seqno,
            messages: internalMessage,
            secretKey: seed ? Buffer.from(secretK) : Buffer.alloc(0),
            sendMode: txData.sendMode,
            timeout: txData.expireAt
        });
    }
    else if (walletVersion.toLowerCase() == "v4r2") {
        signedMessage = wallet.createTransfer({
            seqno: txData.seqno,
            messages: internalMessage,
            secretKey: seed ? Buffer.from(secretK) : Buffer.alloc(0),
            sendMode: txData.sendMode,
            timeout: txData.expireAt
        });
    }
    else {
    }
    return {
        boc: crypto_lib_1.base.toBase64(signedMessage.toBoc()),
    };
}
exports.jettonTransfer = jettonTransfer;
async function signMultiTransaction(privateKey, messages, seqno, expireAt, workchain, publicKey, walletVersion) {
    if (!expireAt) {
        expireAt = Math.round(Date.now() / 1000) + constant_1.TRANSFER_TIMEOUT_SEC;
    }
    const preparedMessages = messages.map((message) => {
        const { amount, toAddress, stateInit, isBase64Payload, } = message;
        let { payload } = message;
        if (isBase64Payload && typeof payload === 'string') {
            payload = ton_core_2.Cell.fromBase64(payload);
        }
        else if (typeof payload === 'string') {
            try {
                payload = ton_core_2.Cell.fromBase64(payload);
            }
            catch (e) {
            }
        }
        const init = stateInit ? {
            code: stateInit.refs[0],
            data: stateInit.refs[1],
        } : undefined;
        return (0, ton_core_1.internal)({
            value: amount,
            to: toAddress,
            body: payload,
            bounce: (0, address_1.parseAddress)(toAddress).isBounceable,
            init,
        });
    });
    var secretK;
    var publicK;
    if (privateKey) {
        const { secretKey, publicKey } = crypto_lib_1.signUtil.ed25519.fromSeed(crypto_lib_1.base.fromHex(privateKey));
        secretK = secretKey;
        publicK = publicKey;
    }
    else {
        publicK = crypto_lib_1.base.fromHex(publicKey);
    }
    let wallet;
    let transaction;
    if (!walletVersion || walletVersion.toLowerCase() == "v5r1") {
        wallet = WalletContractV5_1.WalletContractV5R1.create({ workchain: workchain == 1 ? 1 : 0, publicKey: Buffer.from(publicK) });
        transaction = wallet.createTransfer({
            seqno,
            secretKey: privateKey ? Buffer.from(secretK) : Buffer.alloc(0),
            messages: preparedMessages,
            sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY + ton_core_1.SendMode.IGNORE_ERRORS,
            timeout: expireAt,
        });
    }
    else if (walletVersion.toLowerCase() == "v4r2") {
        wallet = WalletContractV4_1.WalletContractV4.create({ workchain: workchain == 1 ? 1 : 0, publicKey: Buffer.from(publicK) });
        transaction = wallet.createTransfer({
            seqno,
            secretKey: privateKey ? Buffer.from(secretK) : Buffer.alloc(0),
            messages: preparedMessages,
            sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY + ton_core_1.SendMode.IGNORE_ERRORS,
            timeout: expireAt,
        });
    }
    else {
    }
    const tx = transaction.toBoc().toString("base64");
    const externalMessage = toExternalMessage(wallet, seqno, transaction);
    const externalMsg = externalMessage.toBoc().toString('base64');
    return { seqno: seqno, transaction: tx, externalMessage: externalMsg };
}
exports.signMultiTransaction = signMultiTransaction;
function toExternalMessage(contract, seqno, body) {
    return (0, ton_core_2.beginCell)()
        .storeWritable((0, ton_core_1.storeMessage)((0, ton_core_1.external)({
        to: contract.address,
        init: seqno === 0 ? contract.init : undefined,
        body,
    })))
        .endCell();
}
//# sourceMappingURL=transaction.js.map