"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha512 = void 0;
const crypto_1 = __importDefault(require("crypto"));
async function sha512(source) {
    return crypto_1.default.createHash('sha512').update(source).digest();
}
exports.sha512 = sha512;
//# sourceMappingURL=sha512.js.map