"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBase64Address = exports.convertAddress = exports.validateAddress = exports.getVenomAddressBySeed = exports.parseAddress = exports.getV5R1AddressBySeed = exports.getAddressBySeed = exports.checkSeed = exports.getPubKeyBySeed = void 0;
const crypto_lib_1 = require("@okxweb3/crypto-lib");
const ton_1 = require("../ton");
const ton_core_1 = require("../ton-core");
const WalletContractV4_1 = require("../ton/wallets/WalletContractV4");
const WalletContractV5_1 = require("../ton/wallets/v5r1/WalletContractV5");
function getPubKeyBySeed(seed) {
    checkSeed(seed);
    const { publicKey } = crypto_lib_1.signUtil.ed25519.fromSeed(crypto_lib_1.base.fromHex(seed));
    return crypto_lib_1.base.toHex(publicKey);
}
exports.getPubKeyBySeed = getPubKeyBySeed;
function checkSeed(seed) {
    if (!crypto_lib_1.base.validateHexString(seed)) {
        throw new Error("invalid key");
    }
    const buf = crypto_lib_1.base.fromHex(seed.toLowerCase());
    if (!buf || (buf.length != 32)) {
        throw new Error("invalid key");
    }
}
exports.checkSeed = checkSeed;
function getAddressBySeed(seed, testOnly = false) {
    checkSeed(seed);
    const { publicKey } = crypto_lib_1.signUtil.ed25519.fromSeed(crypto_lib_1.base.fromHex(seed));
    const wallet = WalletContractV4_1.WalletContractV4.create({ workchain: 0, publicKey: Buffer.from(publicKey) });
    return wallet.address.toString({ bounceable: false, testOnly });
}
exports.getAddressBySeed = getAddressBySeed;
function getV5R1AddressBySeed(seed, testOnly = false) {
    checkSeed(seed);
    const { publicKey } = crypto_lib_1.signUtil.ed25519.fromSeed(crypto_lib_1.base.fromHex(seed));
    const wallet = WalletContractV5_1.WalletContractV5R1.create({ workchain: 0, publicKey: Buffer.from(publicKey) });
    console.log("wallet address", wallet.address.toRawString());
    return wallet.address.toString({ bounceable: false, testOnly });
}
exports.getV5R1AddressBySeed = getV5R1AddressBySeed;
function parseAddress(address) {
    try {
        if (ton_core_1.Address.isRaw(address)) {
            return {
                address: ton_core_1.Address.parseRaw(address),
                isRaw: true,
                isValid: true,
            };
        }
        else if (ton_core_1.Address.isFriendly(address)) {
            return {
                ...ton_core_1.Address.parseFriendly(address),
                isUserFriendly: true,
                isValid: true,
            };
        }
    }
    catch (err) {
    }
    return { isValid: false };
}
exports.parseAddress = parseAddress;
function getVenomAddressBySeed(seed) {
    const { publicKey } = crypto_lib_1.signUtil.ed25519.fromSeed(crypto_lib_1.base.fromHex(seed));
    const wallet = ton_1.VenomWalletV3.create({ workchain: 0, publicKey: Buffer.from(publicKey) });
    return wallet.address.toRawString();
}
exports.getVenomAddressBySeed = getVenomAddressBySeed;
function validateAddress(address) {
    try {
        return ton_core_1.Address.parse(address);
    }
    catch (e) {
        return false;
    }
}
exports.validateAddress = validateAddress;
function convertAddress(address) {
    const a = parseAddress(address);
    if (!a.isValid) {
        return a;
    }
    else {
        const rawString = a.address?.toRawString();
        const userFriendlyBounceable = a.address?.toString({ bounceable: true, urlSafe: true });
        const userFriendlyUnbounceable = a.address?.toString({ bounceable: false, urlSafe: true });
        const addrBounceable = { bounceable: true, urlSafe: true, userFriendlyBounceable: userFriendlyBounceable };
        const addrUnounceable = { bounceable: false, urlSafe: true, userFriendlyUnbounceable: userFriendlyUnbounceable };
        return {
            raw: rawString,
            addrBounceable,
            addrUnounceable,
        };
    }
}
exports.convertAddress = convertAddress;
function toBase64Address(address, isBounceable = true, network) {
    if (typeof address === 'string') {
        address = ton_core_1.Address.parse(address);
    }
    return address.toString({
        urlSafe: true,
        bounceable: isBounceable,
        testOnly: network === 'testnet',
    });
}
exports.toBase64Address = toBase64Address;
//# sourceMappingURL=address.js.map