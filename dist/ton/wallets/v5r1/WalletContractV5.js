"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletContractV5R1 = void 0;
const ton_core_1 = require("../../../ton-core");
const WalletV5R1WalletId_1 = require("./WalletV5R1WalletId");
const createWalletTransfer_1 = require("../signing/createWalletTransfer");
class WalletContractV5 {
    constructor(codeString, workchain, publicKey, walletId) {
        this.workchain = workchain;
        this.publicKey = publicKey;
        if (walletId !== null && walletId !== undefined) {
            this.walletId = walletId;
        }
        else {
            this.walletId = {
                networkGlobalId: -239,
                context: {
                    walletVersion: "v5r1",
                    workchain: 0,
                    subwalletNumber: 0
                }
            };
        }
        let code = ton_core_1.Cell.fromBoc(Buffer.from(codeString, 'base64'))[0];
        let data = (0, ton_core_1.beginCell)()
            .storeUint(1, 1)
            .storeUint(0, 32)
            .store((0, WalletV5R1WalletId_1.storeWalletIdV5R1)(this.walletId))
            .storeBuffer(this.publicKey, 32)
            .storeBit(0)
            .endCell();
        this.init = { code, data };
        this.address = (0, ton_core_1.contractAddress)(workchain, { code, data });
    }
    async getBalance(provider) {
        let state = await provider.getState();
        return state.balance;
    }
    async getSeqno(provider) {
        let state = await provider.getState();
        if (state.state.type === 'active') {
            let res = await provider.get('seqno', []);
            return res.stack.readNumber();
        }
        else {
            return 0;
        }
    }
    async getExtensions(provider) {
        let state = await provider.getState();
        if (state.state.type === 'active') {
            const result = await provider.get('get_extensions', []);
            return result.stack.readCellOpt();
        }
        else {
            return null;
        }
    }
    async getExtensionsArray(provider) {
        const extensions = await this.getExtensions(provider);
        if (!extensions) {
            return [];
        }
        const dict = ton_core_1.Dictionary.loadDirect(ton_core_1.Dictionary.Keys.BigUint(256), ton_core_1.Dictionary.Values.BigInt(1), extensions);
        return dict.keys().map(addressHex => {
            const wc = this.address.workChain;
            return ton_core_1.Address.parseRaw(`${wc}:${addressHex.toString(16).padStart(64, '0')}`);
        });
    }
    async getIsSecretKeyAuthEnabled(provider) {
        let res = await provider.get('is_signature_allowed', []);
        return res.stack.readBoolean();
    }
    async send(provider, message) {
        await provider.external(message);
    }
    async sendTransfer(provider, args) {
        const transfer = await this.createTransfer(args);
        await this.send(provider, transfer);
    }
    async sendAddExtension(provider, args) {
        const request = await this.createAddExtension(args);
        await this.send(provider, request);
    }
    async sendRemoveExtension(provider, args) {
        const request = await this.createRemoveExtension(args);
        await this.send(provider, request);
    }
    createActions(args) {
        const actions = args.messages.map(message => ({ type: 'sendMsg', mode: args.sendMode, outMsg: message }));
        return actions;
    }
    createTransfer(args) {
        let sendMode = ton_core_1.SendMode.PAY_GAS_SEPARATELY + ton_core_1.SendMode.IGNORE_ERRORS;
        if (args.sendMode !== null && args.sendMode !== undefined) {
            sendMode = args.sendMode;
        }
        let isForSimulate = false;
        if (!args.secretKey || args.secretKey.length == 0) {
            args.secretKey = Buffer.alloc(64);
            isForSimulate = true;
        }
        let body = this.createRequest({
            actions: this.createActions({ messages: args.messages, sendMode: sendMode }),
            ...args
        });
        if (isForSimulate) {
            return body;
        }
        const externalMessage = (0, ton_core_1.external)({
            to: this.address,
            init: args.seqno === 0 ? { code: this.init.code, data: this.init.data } : undefined,
            body: body
        });
        return (0, ton_core_1.beginCell)()
            .store((0, ton_core_1.storeMessage)(externalMessage))
            .endCell();
    }
    createAddExtension(args) {
        return this.createRequest({
            actions: [{
                    type: 'addExtension',
                    address: args.extensionAddress
                }],
            ...args
        });
    }
    createRemoveExtension(args) {
        return this.createRequest({
            actions: [{
                    type: 'removeExtension',
                    address: args.extensionAddress
                }],
            ...args
        });
    }
    createRequest(args) {
        if (args.authType === 'extension') {
            return (0, createWalletTransfer_1.createWalletTransferV5R1)(args);
        }
        return (0, createWalletTransfer_1.createWalletTransferV5R1)({
            ...args,
            walletId: (0, WalletV5R1WalletId_1.storeWalletIdV5R1)(this.walletId)
        });
    }
    sender(provider, secretKey) {
        return {
            send: async (args) => {
                let seqno = await this.getSeqno(provider);
                let transfer = this.createTransfer({
                    seqno,
                    secretKey,
                    sendMode: args.sendMode ?? ton_core_1.SendMode.PAY_GAS_SEPARATELY + ton_core_1.SendMode.IGNORE_ERRORS,
                    messages: [(0, ton_core_1.internal)({
                            to: args.to,
                            value: args.value,
                            init: args.init,
                            body: args.body,
                            bounce: args.bounce
                        })]
                });
                await this.send(provider, transfer);
            }
        };
    }
}
WalletContractV5.OpCodes = {
    auth_extension: 0x6578746e,
    auth_signed_external: 0x7369676e,
    auth_signed_internal: 0x73696e74
};
class WalletContractV5R1 extends WalletContractV5 {
    static create(args) {
        return new WalletContractV5R1(args.workchain, args.publicKey, args.walletId);
    }
    constructor(workchain, publicKey, walletId) {
        let code = "te6cckECFAEAAoEAART/APSkE/S88sgLAQIBIAINAgFIAwQC3NAg10nBIJFbj2Mg1wsfIIIQZXh0br0hghBzaW50vbCSXwPgghBleHRuuo60gCDXIQHQdNch+kAw+kT4KPpEMFi9kVvg7UTQgQFB1yH0BYMH9A5voTGRMOGAQNchcH/bPOAxINdJgQKAuZEw4HDiEA8CASAFDAIBIAYJAgFuBwgAGa3OdqJoQCDrkOuF/8AAGa8d9qJoQBDrkOuFj8ACAUgKCwAXsyX7UTQcdch1wsfgABGyYvtRNDXCgCAAGb5fD2omhAgKDrkPoCwBAvIOAR4g1wsfghBzaWduuvLgin8PAeaO8O2i7fshgwjXIgKDCNcjIIAg1yHTH9Mf0x/tRNDSANMfINMf0//XCgAK+QFAzPkQmiiUXwrbMeHywIffArNQB7Dy0IRRJbry4IVQNrry4Ib4I7vy0IgikvgA3gGkf8jKAMsfAc8Wye1UIJL4D95w2zzYEAP27aLt+wL0BCFukmwhjkwCIdc5MHCUIccAs44tAdcoIHYeQ2wg10nACPLgkyDXSsAC8uCTINcdBscSwgBSMLDy0InXTNc5MAGk6GwShAe78uCT10rAAPLgk+1V4tIAAcAAkVvg69csCBQgkXCWAdcsCBwS4lIQseMPINdKERITAJYB+kAB+kT4KPpEMFi68uCR7UTQgQFB1xj0BQSdf8jKAEAEgwf0U/Lgi44UA4MH9Fvy4Iwi1woAIW4Bs7Dy0JDiyFADzxYS9ADJ7VQAcjDXLAgkji0h8uCS0gDtRNDSAFETuvLQj1RQMJExnAGBAUDXIdcKAPLgjuLIygBYzxbJ7VST8sCN4gAQk1vbMeHXTNC01sNe";
        super(code, workchain, publicKey, walletId);
    }
}
exports.WalletContractV5R1 = WalletContractV5R1;
//# sourceMappingURL=WalletContractV5.js.map