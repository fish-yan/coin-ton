"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.address = exports.Address = void 0;
const symbol_inspect_1 = __importDefault(require("symbol.inspect"));
const crc16_1 = require("../utils/crc16");
const bounceable_tag = 0x11;
const non_bounceable_tag = 0x51;
const test_flag = 0x80;
function parseFriendlyAddress(src) {
    if (typeof src === 'string' && !Address.isFriendly(src)) {
        throw new Error('Unknown address type');
    }
    const data = Buffer.isBuffer(src) ? src : Buffer.from(src, 'base64');
    if (data.length !== 36) {
        throw new Error('Unknown address type: byte length is not equal to 36');
    }
    const addr = data.subarray(0, 34);
    const crc = data.subarray(34, 36);
    const calcedCrc = (0, crc16_1.crc16)(addr);
    if (!(calcedCrc[0] === crc[0] && calcedCrc[1] === crc[1])) {
        throw new Error('Invalid checksum: ' + src);
    }
    let tag = addr[0];
    let isTestOnly = false;
    let isBounceable = false;
    if (tag & test_flag) {
        isTestOnly = true;
        tag = tag ^ test_flag;
    }
    if ((tag !== bounceable_tag) && (tag !== non_bounceable_tag))
        throw "Unknown address tag";
    isBounceable = tag === bounceable_tag;
    let workchain = null;
    if (addr[1] === 0xff) {
        workchain = -1;
    }
    else {
        workchain = addr[1];
    }
    const hashPart = addr.subarray(2, 34);
    return { isTestOnly, isBounceable, workchain, hashPart };
}
class Address {
    static isAddress(src) {
        return src instanceof Address;
    }
    static isFriendly(source) {
        if (source.length !== 48) {
            return false;
        }
        if (!/[A-Za-z0-9+/_-]+/.test(source)) {
            return false;
        }
        return true;
    }
    static isRaw(source) {
        if (source.indexOf(':') === -1) {
            return false;
        }
        let [wc, hash] = source.split(':');
        if (!Number.isInteger(parseFloat(wc))) {
            return false;
        }
        if (!/[a-f0-9]+/.test(hash.toLowerCase())) {
            return false;
        }
        if (hash.length !== 64) {
            return false;
        }
        return true;
    }
    static normalize(source) {
        if (typeof source === 'string') {
            return Address.parse(source).toString();
        }
        else {
            return source.toString();
        }
    }
    static parse(source) {
        if (Address.isFriendly(source)) {
            return this.parseFriendly(source).address;
        }
        else if (Address.isRaw(source)) {
            return this.parseRaw(source);
        }
        else {
            throw new Error('Unknown address type: ' + source);
        }
    }
    static parseRaw(source) {
        let workChain = parseInt(source.split(":")[0]);
        let hash = Buffer.from(source.split(":")[1], 'hex');
        return new Address(workChain, hash);
    }
    static parseFriendly(source) {
        if (Buffer.isBuffer(source)) {
            let r = parseFriendlyAddress(source);
            return {
                isBounceable: r.isBounceable,
                isTestOnly: r.isTestOnly,
                address: new Address(r.workchain, r.hashPart)
            };
        }
        else {
            let addr = source.replace(/\-/g, '+').replace(/_/g, '\/');
            let r = parseFriendlyAddress(addr);
            return {
                isBounceable: r.isBounceable,
                isTestOnly: r.isTestOnly,
                isUrlSafe: !(source.includes(`\/`) || source.includes(`+`)),
                address: new Address(r.workchain, r.hashPart)
            };
        }
    }
    constructor(workChain, hash) {
        this.toRawString = () => {
            return this.workChain + ':' + this.hash.toString('hex');
        };
        this.toRaw = () => {
            const addressWithChecksum = Buffer.alloc(36);
            addressWithChecksum.set(this.hash);
            addressWithChecksum.set([this.workChain, this.workChain, this.workChain, this.workChain], 32);
            return addressWithChecksum;
        };
        this.toStringBuffer = (args) => {
            let testOnly = (args && args.testOnly !== undefined) ? args.testOnly : false;
            let bounceable = (args && args.bounceable !== undefined) ? args.bounceable : true;
            let tag = bounceable ? bounceable_tag : non_bounceable_tag;
            if (testOnly) {
                tag |= test_flag;
            }
            const addr = Buffer.alloc(34);
            addr[0] = tag;
            addr[1] = this.workChain;
            addr.set(this.hash, 2);
            const addressWithChecksum = Buffer.alloc(36);
            addressWithChecksum.set(addr);
            addressWithChecksum.set((0, crc16_1.crc16)(addr), 34);
            return addressWithChecksum;
        };
        this.toString = (args) => {
            let urlSafe = (args && args.urlSafe !== undefined) ? args.urlSafe : true;
            let buffer = this.toStringBuffer(args);
            if (urlSafe) {
                return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
            }
            else {
                return buffer.toString('base64');
            }
        };
        this[_a] = () => this.toString();
        if (hash.length !== 32) {
            throw new Error('Invalid address hash length: ' + hash.length);
        }
        this.workChain = workChain;
        this.hash = hash;
        Object.freeze(this);
    }
    equals(src) {
        if (src.workChain !== this.workChain) {
            return false;
        }
        return src.hash.equals(this.hash);
    }
}
exports.Address = Address;
_a = symbol_inspect_1.default;
function address(src) {
    return Address.parse(src);
}
exports.address = address;
//# sourceMappingURL=Address.js.map