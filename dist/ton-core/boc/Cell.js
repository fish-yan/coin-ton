"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
const symbol_inspect_1 = __importDefault(require("symbol.inspect"));
const BitString_1 = require("./BitString");
const CellType_1 = require("./CellType");
const Slice_1 = require("./Slice");
const resolveExotic_1 = require("./cell/resolveExotic");
const wonderCalculator_1 = require("./cell/wonderCalculator");
const serialization_1 = require("./cell/serialization");
const BitReader_1 = require("./BitReader");
const Builder_1 = require("./Builder");
class Cell {
    static fromBoc(src) {
        return (0, serialization_1.deserializeBoc)(src);
    }
    static fromBase64(src) {
        let parsed = Cell.fromBoc(Buffer.from(src, 'base64'));
        if (parsed.length !== 1) {
            throw new Error("Deserialized more than one cell");
        }
        return parsed[0];
    }
    constructor(opts) {
        this._hashes = [];
        this._depths = [];
        this.beginParse = (allowExotic = false) => {
            if (this.isExotic && !allowExotic) {
                throw new Error("Exotic cells cannot be parsed");
            }
            return new Slice_1.Slice(new BitReader_1.BitReader(this.bits), this.refs);
        };
        this.hash = (level = 3) => {
            return this._hashes[Math.min(this._hashes.length - 1, level)];
        };
        this.depth = (level = 3) => {
            return this._depths[Math.min(this._depths.length - 1, level)];
        };
        this.level = () => {
            return this.mask.level;
        };
        this.equals = (other) => {
            return this.hash().equals(other.hash());
        };
        this[_a] = () => this.toString();
        let bits = BitString_1.BitString.EMPTY;
        if (opts && opts.bits) {
            bits = opts.bits;
        }
        let refs = [];
        if (opts && opts.refs) {
            refs = [...opts.refs];
        }
        let hashes;
        let depths;
        let mask;
        let type = CellType_1.CellType.Ordinary;
        if (opts && opts.exotic) {
            let resolved = (0, resolveExotic_1.resolveExotic)(bits, refs);
            let wonders = (0, wonderCalculator_1.wonderCalculator)(resolved.type, bits, refs);
            mask = wonders.mask;
            depths = wonders.depths;
            hashes = wonders.hashes;
            type = resolved.type;
        }
        else {
            if (refs.length > 4) {
                throw new Error("Invalid number of references");
            }
            if (bits.length > 1023) {
                throw new Error(`Bits overflow: ${bits.length} > 1023`);
            }
            let wonders = (0, wonderCalculator_1.wonderCalculator)(CellType_1.CellType.Ordinary, bits, refs);
            mask = wonders.mask;
            depths = wonders.depths;
            hashes = wonders.hashes;
            type = CellType_1.CellType.Ordinary;
        }
        this.type = type;
        this.bits = bits;
        this.refs = refs;
        this.mask = mask;
        this._depths = depths;
        this._hashes = hashes;
        Object.freeze(this);
        Object.freeze(this.refs);
        Object.freeze(this.bits);
        Object.freeze(this.mask);
        Object.freeze(this._depths);
        Object.freeze(this._hashes);
    }
    get isExotic() {
        return this.type !== CellType_1.CellType.Ordinary;
    }
    toBoc(opts) {
        let idx = (opts && opts.idx !== null && opts.idx !== undefined) ? opts.idx : false;
        let crc32 = (opts && opts.crc32 !== null && opts.crc32 !== undefined) ? opts.crc32 : true;
        return (0, serialization_1.serializeBoc)(this, { idx, crc32 });
    }
    toString(indent) {
        let id = indent || '';
        let t = 'x';
        if (this.isExotic) {
            if (this.type === CellType_1.CellType.MerkleProof) {
                t = 'p';
            }
            else if (this.type === CellType_1.CellType.MerkleUpdate) {
                t = 'u';
            }
            else if (this.type === CellType_1.CellType.PrunedBranch) {
                t = 'p';
            }
        }
        let s = id + (this.isExotic ? t : 'x') + '{' + this.bits.toString() + '}';
        for (let k in this.refs) {
            const i = this.refs[k];
            s += '\n' + i.toString(id + ' ');
        }
        return s;
    }
    asSlice() {
        return this.beginParse();
    }
    asBuilder() {
        return (0, Builder_1.beginCell)().storeSlice(this.asSlice());
    }
}
exports.Cell = Cell;
_a = symbol_inspect_1.default;
Cell.EMPTY = new Cell();
//# sourceMappingURL=Cell.js.map