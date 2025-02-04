"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalAddress = void 0;
const symbol_inspect_1 = __importDefault(require("symbol.inspect"));
class ExternalAddress {
    static isAddress(src) {
        return src instanceof ExternalAddress;
    }
    constructor(value, bits) {
        this[_a] = () => this.toString();
        this.value = value;
        this.bits = bits;
    }
    toString() {
        return `External<${this.bits}:${this.value}>`;
    }
}
exports.ExternalAddress = ExternalAddress;
_a = symbol_inspect_1.default;
//# sourceMappingURL=ExternalAddress.js.map