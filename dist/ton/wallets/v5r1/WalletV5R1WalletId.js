"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeWalletIdV5R1 = exports.loadWalletIdV5R1 = exports.isWalletIdV5R1ClientContext = void 0;
const ton_core_1 = require("../../../ton-core");
function isWalletIdV5R1ClientContext(context) {
    return typeof context !== 'number';
}
exports.isWalletIdV5R1ClientContext = isWalletIdV5R1ClientContext;
const walletV5R1VersionsSerialisation = {
    v5r1: 0
};
function loadWalletIdV5R1(value, networkGlobalId) {
    const val = new ton_core_1.BitReader(new ton_core_1.BitString(typeof value === 'bigint' ?
        Buffer.from(value.toString(16), 'hex') :
        value instanceof ton_core_1.Slice ? value.loadBuffer(4) : value, 0, 32)).loadInt(32);
    const context = BigInt(val) ^ BigInt(networkGlobalId);
    const bitReader = (0, ton_core_1.beginCell)().storeInt(context, 32).endCell().beginParse();
    const isClientContext = bitReader.loadUint(1);
    if (isClientContext) {
        const workchain = bitReader.loadInt(8);
        const walletVersionRaw = bitReader.loadUint(8);
        const subwalletNumber = bitReader.loadUint(15);
        const walletVersion = Object.entries(walletV5R1VersionsSerialisation).find(([_, value]) => value === walletVersionRaw)?.[0];
        if (walletVersion === undefined) {
            throw new Error(`Can't deserialize walletId: unknown wallet version ${walletVersionRaw}`);
        }
        return {
            networkGlobalId,
            context: {
                walletVersion,
                workchain,
                subwalletNumber
            }
        };
    }
    else {
        const context = bitReader.loadUint(31);
        return {
            networkGlobalId,
            context
        };
    }
}
exports.loadWalletIdV5R1 = loadWalletIdV5R1;
function storeWalletIdV5R1(walletId) {
    return (builder) => {
        let context;
        if (isWalletIdV5R1ClientContext(walletId.context)) {
            context = (0, ton_core_1.beginCell)()
                .storeUint(1, 1)
                .storeInt(walletId.context.workchain, 8)
                .storeUint(walletV5R1VersionsSerialisation[walletId.context.walletVersion], 8)
                .storeUint(walletId.context.subwalletNumber, 15)
                .endCell().beginParse().loadInt(32);
        }
        else {
            context = (0, ton_core_1.beginCell)()
                .storeUint(0, 1)
                .storeUint(walletId.context, 31)
                .endCell().beginParse().loadInt(32);
        }
        return builder.storeInt(BigInt(walletId.networkGlobalId) ^ BigInt(context), 32);
    };
}
exports.storeWalletIdV5R1 = storeWalletIdV5R1;
//# sourceMappingURL=WalletV5R1WalletId.js.map