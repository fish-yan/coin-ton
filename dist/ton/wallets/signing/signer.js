"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signPayload = void 0;
;
const ton_crypto_1 = require("../../../ton-crypto");
function signPayload(args, signingMessage, packMessage) {
    if ('secretKey' in args) {
        return packMessage((0, ton_crypto_1.sign)(signingMessage.endCell().hash(), args.secretKey), signingMessage);
    }
    else {
        return args.signer(signingMessage.endCell())
            .then(signature => packMessage(signature, signingMessage));
    }
}
exports.signPayload = signPayload;
//# sourceMappingURL=signer.js.map