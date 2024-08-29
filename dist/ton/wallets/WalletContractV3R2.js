"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletContractV3R2 = void 0;
const ton_core_1 = require("../../ton-core");
const crypto_lib_1 = require("@okxweb3/crypto-lib");
class WalletContractV3R2 {
    static create(args) {
        return new WalletContractV3R2(args.workchain, args.publicKey, args.walletId);
    }
    constructor(workchain, publicKey, walletId) {
        this.workchain = workchain;
        this.publicKey = publicKey;
        if (walletId !== null && walletId !== undefined) {
            this.walletId = walletId;
        }
        else {
            this.walletId = 698983191 + workchain;
        }
        let code = ton_core_1.Cell.fromBoc(Buffer.from('te6cckEBAQEAcQAA3v8AIN0gggFMl7ohggEznLqxn3Gw7UTQ0x/THzHXC//jBOCk8mCDCNcYINMf0x/TH/gjE7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDo0QGkyMsfyx/L/8ntVBC9ba0=', 'base64'))[0];
        let data = (0, ton_core_1.beginCell)()
            .storeUint(0, 32)
            .storeUint(this.walletId, 32)
            .storeBuffer(publicKey)
            .endCell();
        this.init = { code, data };
        this.address = (0, ton_core_1.contractAddress)(workchain, { code, data });
    }
    createTransfer(args) {
        let sendMode = ton_core_1.SendMode.PAY_GAS_SEPARATELY + ton_core_1.SendMode.IGNORE_ERRORS;
        if (args.sendMode !== null && args.sendMode !== undefined) {
            sendMode = args.sendMode;
        }
        const body = this.createWalletTransferV3({
            seqno: args.seqno,
            sendMode,
            secretKey: args.secretKey,
            messages: args.messages,
            timeout: args.timeout,
            walletId: this.walletId
        });
        const externalMessage = (0, ton_core_1.external)({
            to: this.address,
            init: args.seqno === 0 ? { code: this.init.code, data: this.init.data } : undefined,
            body
        });
        return (0, ton_core_1.beginCell)()
            .store((0, ton_core_1.storeMessage)(externalMessage))
            .endCell();
    }
    createWalletTransferV3(args) {
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
        for (let m of args.messages) {
            signingMessage.storeUint(args.sendMode, 8);
            signingMessage.storeRef((0, ton_core_1.beginCell)().store((0, ton_core_1.storeMessageRelaxed)(m)));
        }
        let signature = crypto_lib_1.signUtil.ed25519.sign(signingMessage.endCell().hash(), args.secretKey);
        return (0, ton_core_1.beginCell)()
            .storeBuffer(Buffer.from(signature))
            .storeBuilder(signingMessage)
            .endCell();
    }
}
exports.WalletContractV3R2 = WalletContractV3R2;
//# sourceMappingURL=WalletContractV3R2.js.map