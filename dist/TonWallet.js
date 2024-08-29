"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTonWallet = exports.JettonWallet = exports.VenomWallet = exports.TonWallet = void 0;
const coin_base_1 = require("@okxweb3/coin-base");
const address_1 = require("./api/address");
const transaction_1 = require("./api/transaction");
const tonweb_mnemonic_1 = require("tonweb-mnemonic");
const crypto_lib_1 = require("@okxweb3/crypto-lib");
const WalletContractV4_1 = require("./ton/wallets/WalletContractV4");
const ton_core_1 = require("./ton-core");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const api_1 = require("./api");
const constant_1 = require("./api/constant");
const WalletContractV5_1 = require("./ton/wallets/v5r1/WalletContractV5");
function checkPrivateKey(privateKeyHex) {
    var privateKey = privateKeyHex.startsWith('0x') ? privateKeyHex : '0x' + privateKeyHex;
    if (!crypto_lib_1.base.isHexString(privateKey)) {
        return false;
    }
    return true;
}
class TonWallet extends coin_base_1.BaseWallet {
    async getRandomPrivateKey() {
        try {
            return Promise.resolve((0, coin_base_1.ed25519_getRandomPrivateKey)(false, "hex"));
        }
        catch (e) {
            return Promise.reject(coin_base_1.GenPrivateKeyError);
        }
    }
    async getDerivedPath(param) {
        return `m/44'/607'/${param.index}'`;
    }
    async getDerivedPrivateKey(param) {
        try {
            if (param.hdPath) {
                return Promise.resolve((0, coin_base_1.ed25519_getDerivedPrivateKey)(param, false, "hex"));
            }
            else {
                const seedBytes = await (0, tonweb_mnemonic_1.mnemonicToSeed)(param.mnemonic.split(` `));
                const seed = crypto_lib_1.base.toHex(seedBytes);
                return Promise.resolve(seed);
            }
        }
        catch (e) {
            return Promise.reject(coin_base_1.GenPrivateKeyError);
        }
    }
    async getNewAddress(param) {
        try {
            if (!crypto_lib_1.base.validateHexString(param.privateKey)) {
                return Promise.reject(coin_base_1.NewAddressError);
            }
            let walletVersion = param.walletVersion;
            let address;
            if (!walletVersion || walletVersion.toLowerCase() == "v5r1") {
                address = (0, address_1.getV5R1AddressBySeed)(param.privateKey.toLowerCase());
            }
            else if (walletVersion.toLowerCase() == "v4r2") {
                address = (0, address_1.getAddressBySeed)(param.privateKey.toLowerCase());
            }
            else {
                throw coin_base_1.NewAddressError;
            }
            const data = {
                address: address,
                publicKey: (0, address_1.getPubKeyBySeed)(param.privateKey.toLowerCase()),
            };
            return Promise.resolve(data);
        }
        catch (e) {
            return Promise.reject(coin_base_1.NewAddressError);
        }
    }
    async validPrivateKey(param) {
        (0, address_1.checkSeed)(param.privateKey);
        const data = {
            isValid: true,
            privateKey: param.privateKey
        };
        return Promise.resolve(data);
    }
    async validAddress(param) {
        const res = (0, address_1.parseAddress)(param.address);
        return Promise.resolve(res);
    }
    async parseAddress(param) {
        const res = (0, address_1.parseAddress)(param.address);
        return Promise.resolve(res);
    }
    async convertAddress(param) {
        const res = (0, address_1.convertAddress)(param.address);
        return Promise.resolve(res);
    }
    async validateMnemonicOfTon(param) {
        return (0, tonweb_mnemonic_1.validateMnemonic)(param.mnemonicArray, param.password);
    }
    async signTransaction(param) {
        const data = param.data;
        try {
            if (data.type == "transfer") {
                return (0, transaction_1.transfer)(param.data, param.privateKey, data.version);
            }
            else if (data.type == "jettonTransfer") {
                return (0, transaction_1.jettonTransfer)(param.data, param.privateKey, data.version);
            }
        }
        catch (e) {
            return Promise.reject(coin_base_1.SignTxError);
        }
    }
    async signJettonTransaction(param) {
        const data = param.data;
        try {
            return (0, transaction_1.jettonTransfer)(param.data, param.privateKey, data.version);
        }
        catch (e) {
            return Promise.reject(coin_base_1.SignTxError);
        }
    }
    async getWalletInformation(params) {
        const { workChain, publicKey, privateKey, walletVersion } = params;
        const chain = workChain == 1 ? 1 : 0;
        let pub;
        if (publicKey) {
            pub = crypto_lib_1.base.fromHex(publicKey);
        }
        else {
            const { publicKey } = crypto_lib_1.signUtil.ed25519.fromSeed(crypto_lib_1.base.fromHex(privateKey));
            pub = Buffer.from(publicKey);
        }
        let wallet;
        if (!walletVersion || walletVersion.toLowerCase() == "v5r1") {
            wallet = WalletContractV5_1.WalletContractV5R1.create({ workchain: chain, publicKey: pub });
        }
        else if (walletVersion.toLowerCase() == "v4r2") {
            wallet = WalletContractV4_1.WalletContractV4.create({ workchain: chain, publicKey: pub });
        }
        else {
        }
        const initCode = wallet.init?.code?.toBoc().toString('base64');
        const initData = wallet.init?.data?.toBoc().toString('base64');
        const walletAddress = wallet.address;
        const walletStateInit = (0, ton_core_1.beginCell)()
            .storeWritable((0, ton_core_1.storeStateInit)(wallet.init))
            .endCell()
            .toBoc()
            .toString('base64');
        return {
            initCode: initCode,
            initData: initData,
            walletStateInit: walletStateInit,
            walletAddress: walletAddress.toString({ bounceable: false }),
        };
    }
    async getTransactionBodyForSimulate(param) {
        if (param.privateKey) {
            const { publicKey } = crypto_lib_1.signUtil.ed25519.fromSeed(crypto_lib_1.base.fromHex(param.privateKey));
            const publicKeyHex = crypto_lib_1.base.toHex(publicKey);
            if (param.data.publicKey && param.data.publicKey != publicKeyHex) {
                throw new Error("public key not pair the private key");
            }
            if (!param.data.publicKey) {
                param.data.publicKey = publicKeyHex;
            }
            param.privateKey = '';
        }
        else {
            if (!param.data.publicKey) {
                throw new Error("both private key and public key are null");
            }
        }
        const res = await this.signTransaction(param);
        return Promise.resolve(res.boc);
    }
    async calcTxHash(param) {
        try {
            const message = ton_core_1.Cell.fromBase64(param.data);
            const messageHash = message.hash().toString('hex');
            return Promise.resolve(messageHash);
        }
        catch (e) {
            return Promise.reject(coin_base_1.CalcTxHashError);
        }
    }
    async signTonProof(param) {
        const { timestamp, domain, payload } = param.proof;
        const timestampBuffer = Buffer.allocUnsafe(8);
        timestampBuffer.writeBigInt64LE(BigInt(timestamp));
        const domainBuffer = Buffer.from(domain);
        const domainLengthBuffer = Buffer.allocUnsafe(4);
        domainLengthBuffer.writeInt32LE(domainBuffer.byteLength);
        const address = ton_core_1.Address.parse(param.walletAddress);
        const addressWorkchainBuffer = Buffer.allocUnsafe(4);
        addressWorkchainBuffer.writeInt32BE(address.workChain);
        const addressBuffer = Buffer.concat([
            addressWorkchainBuffer,
            address.hash,
        ]);
        const messageBuffer = Buffer.concat([
            Buffer.from(param.tonProofItem, 'utf8'),
            addressBuffer,
            domainLengthBuffer,
            domainBuffer,
            timestampBuffer,
            Buffer.from(payload),
        ]);
        const bufferToSign = Buffer.concat([
            Buffer.from(param.messageSalt, 'hex'),
            Buffer.from(param.messageAction, 'utf8'),
            Buffer.from(await crypto_lib_1.base.sha256(messageBuffer)),
        ]);
        const { secretKey } = crypto_lib_1.signUtil.ed25519.fromSeed(crypto_lib_1.base.fromHex(param.privateKey));
        const signature = tweetnacl_1.default.sign.detached(Buffer.from(await crypto_lib_1.base.sha256(bufferToSign)), Buffer.from(secretKey));
        return Promise.resolve(Buffer.from(signature).toString('base64'));
    }
    async signMultiTransaction(param) {
        const txPayload = param.data;
        if (txPayload.messages.length > 4) {
            throw new Error('Payload contains more than 4 messages, which exceeds limit');
        }
        let validUntil = txPayload.valid_until;
        if (validUntil && validUntil > 10 ** 10) {
            validUntil = Math.round(validUntil / 1000);
        }
        if (validUntil && validUntil < (Date.now() / 1000)) {
            throw new Error('the confirmation timeout has expired');
        }
        const tonTransferParams = [];
        txPayload.messages.map(m => {
            tonTransferParams.push({
                toAddress: m.address,
                amount: BigInt(m.amount),
                payload: m.payload,
                stateInit: m.stateInit ? ton_core_1.Cell.fromBase64(m.stateInit) : undefined,
                isBase64Payload: m.isBase64Payload,
            });
        });
        const network = txPayload.network === "1" || txPayload.network === "testnet" ? 1 : 0;
        return await (0, transaction_1.signMultiTransaction)(param.privateKey, tonTransferParams, txPayload.seqno, validUntil, network, txPayload.publicKey);
    }
    async simulateMultiTransaction(param) {
        if (param.privateKey) {
            const { publicKey } = crypto_lib_1.signUtil.ed25519.fromSeed(crypto_lib_1.base.fromHex(param.privateKey));
            const publicKeyHex = crypto_lib_1.base.toHex(publicKey);
            if (param.data.publicKey && param.data.publicKey != publicKeyHex) {
                throw new Error("public key not pair the private key");
            }
            if (!param.data.publicKey) {
                param.data.publicKey = publicKeyHex;
            }
            param.privateKey = '';
        }
        else {
            if (!param.data.publicKey) {
                throw new Error("both private key and public key are null");
            }
        }
        return this.signMultiTransaction(param);
    }
    async signMultiTransactionForNFT(param) {
        const data = param.data;
        const nftAddresses = data.nftAddresses;
        const messages = nftAddresses.map((nftAddress, index) => {
            const nft = data.nfts?.[index];
            const isNotcoinBurn = nft?.collectionAddress === constant_1.NOTCOIN_VOUCHERS_ADDRESS;
            const payload = isNotcoinBurn
                ? (0, api_1.buildNotcoinVoucherExchange)(data.fromNFTAddress, nftAddress, nft.index)
                : (0, api_1.buildNftTransferPayload)(data.fromNFTAddress, data.toAddress, data.comment);
            return {
                payload,
                amount: constant_1.NFT_TRANSFER_TONCOIN_AMOUNT,
                toAddress: nftAddress,
            };
        });
        return await (0, transaction_1.signMultiTransaction)(param.privateKey, messages, data.seqno, data.expireAt, data.workchain);
    }
    async buildNotcoinVoucherExchange(params) {
        const payload = (0, api_1.buildNotcoinVoucherExchange)(params.fromNFTAddress, params.nftAddress, params.nftIndex);
        return Promise.resolve(payload.toBoc().toString('base64'));
    }
    async buildNftTransferPayload(params) {
        const payload = (0, api_1.buildNftTransferPayload)(params.fromNFTAddress, params.nftAddress, params.comment);
        return Promise.resolve(payload.toBoc().toString('base64'));
    }
}
exports.TonWallet = TonWallet;
class VenomWallet extends TonWallet {
    async getNewAddress(param) {
        try {
            const data = {
                address: (0, address_1.getVenomAddressBySeed)(param.privateKey),
                publicKey: (0, address_1.getPubKeyBySeed)(param.privateKey),
            };
            return Promise.resolve(data);
        }
        catch (e) {
            return Promise.reject(coin_base_1.NewAddressError);
        }
    }
    async signTransaction(param) {
        try {
            return (0, transaction_1.venomTransfer)(param.data, param.privateKey);
        }
        catch (e) {
            return Promise.reject(coin_base_1.SignTxError);
        }
    }
}
exports.VenomWallet = VenomWallet;
class JettonWallet extends TonWallet {
}
exports.JettonWallet = JettonWallet;
class TestTonWallet extends TonWallet {
    async getNewAddress(param) {
        try {
            if (!crypto_lib_1.base.validateHexString(param.privateKey)) {
                return Promise.reject(coin_base_1.NewAddressError);
            }
            let walletVersion = param.walletVersion;
            let address;
            if (!walletVersion || walletVersion.toLowerCase() == "v5r1") {
                address = (0, address_1.getV5R1AddressBySeed)(param.privateKey.toLowerCase(), true);
            }
            else if (walletVersion.toLowerCase() == "v4r2") {
                address = (0, address_1.getAddressBySeed)(param.privateKey.toLowerCase(), true);
            }
            else {
                throw coin_base_1.NewAddressError;
            }
            const data = {
                address: address,
                publicKey: (0, address_1.getPubKeyBySeed)(param.privateKey.toLowerCase()),
            };
            return Promise.resolve(data);
        }
        catch (e) {
            return Promise.reject(coin_base_1.NewAddressError);
        }
    }
    async getWalletInformation(params) {
        const { workChain, publicKey, privateKey, walletVersion } = params;
        const chain = workChain == 1 ? 1 : 0;
        let pub;
        if (publicKey) {
            pub = crypto_lib_1.base.fromHex(publicKey);
        }
        else {
            const { publicKey } = crypto_lib_1.signUtil.ed25519.fromSeed(crypto_lib_1.base.fromHex(privateKey));
            pub = Buffer.from(publicKey);
        }
        let wallet;
        if (!walletVersion || walletVersion.toLowerCase() == "v5r1") {
            wallet = WalletContractV5_1.WalletContractV5R1.create({ workchain: chain, publicKey: pub });
            console.log("v5r1address", wallet.address.toString({ bounceable: false, testOnly: true }));
        }
        else if (walletVersion.toLowerCase() == "v4r2") {
            wallet = WalletContractV4_1.WalletContractV4.create({ workchain: chain, publicKey: pub });
            console.log("v4r2address", wallet.address.toString({ bounceable: false, testOnly: true }));
        }
        else {
        }
        const initCode = wallet.init?.code?.toBoc().toString('base64');
        const initData = wallet.init?.data?.toBoc().toString('base64');
        const walletAddress = wallet.address;
        const walletStateInit = (0, ton_core_1.beginCell)()
            .storeWritable((0, ton_core_1.storeStateInit)(wallet.init))
            .endCell()
            .toBoc()
            .toString('base64');
        return {
            initCode: initCode,
            initData: initData,
            walletStateInit: walletStateInit,
            walletAddress: walletAddress.toString({ bounceable: false, testOnly: true }),
        };
    }
}
exports.TestTonWallet = TestTonWallet;
//# sourceMappingURL=TonWallet.js.map