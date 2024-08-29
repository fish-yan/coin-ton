"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeBoc = exports.deserializeBoc = exports.parseBoc = void 0;
const BitReader_1 = require("../BitReader");
const BitString_1 = require("../BitString");
const Cell_1 = require("../Cell");
const topologicalSort_1 = require("./utils/topologicalSort");
const bitsForNumber_1 = require("../../utils/bitsForNumber");
const BitBuilder_1 = require("../BitBuilder");
const descriptor_1 = require("./descriptor");
const paddedBits_1 = require("../utils/paddedBits");
const crc32c_1 = require("../../utils/crc32c");
function getHashesCount(levelMask) {
    return getHashesCountFromMask(levelMask & 7);
}
function getHashesCountFromMask(mask) {
    let n = 0;
    for (let i = 0; i < 3; i++) {
        n += (mask & 1);
        mask = mask >> 1;
    }
    return n + 1;
}
function readCell(reader, sizeBytes) {
    const d1 = reader.loadUint(8);
    const refsCount = d1 % 8;
    const exotic = !!(d1 & 8);
    const d2 = reader.loadUint(8);
    const dataBytesize = Math.ceil(d2 / 2);
    const paddingAdded = !!(d2 % 2);
    const levelMask = d1 >> 5;
    const hasHashes = (d1 & 16) != 0;
    const hash_bytes = 32;
    const hashesSize = hasHashes ? getHashesCount(levelMask) * hash_bytes : 0;
    const depthSize = hasHashes ? getHashesCount(levelMask) * 2 : 0;
    reader.skip(hashesSize * 8);
    reader.skip(depthSize * 8);
    let bits = BitString_1.BitString.EMPTY;
    if (dataBytesize > 0) {
        if (paddingAdded) {
            bits = reader.loadPaddedBits(dataBytesize * 8);
        }
        else {
            bits = reader.loadBits(dataBytesize * 8);
        }
    }
    let refs = [];
    for (let i = 0; i < refsCount; i++) {
        refs.push(reader.loadUint(sizeBytes * 8));
    }
    return {
        bits,
        refs,
        exotic
    };
}
function calcCellSize(cell, sizeBytes) {
    return 2 + Math.ceil(cell.bits.length / 8) + cell.refs.length * sizeBytes;
}
function parseBoc(src) {
    let reader = new BitReader_1.BitReader(new BitString_1.BitString(src, 0, src.length * 8));
    let magic = reader.loadUint(32);
    if (magic === 0x68ff65f3) {
        let size = reader.loadUint(8);
        let offBytes = reader.loadUint(8);
        let cells = reader.loadUint(size * 8);
        let roots = reader.loadUint(size * 8);
        let absent = reader.loadUint(size * 8);
        let totalCellSize = reader.loadUint(offBytes * 8);
        let index = reader.loadBuffer(cells * offBytes);
        let cellData = reader.loadBuffer(totalCellSize);
        return {
            size,
            offBytes,
            cells,
            roots,
            absent,
            totalCellSize,
            index,
            cellData,
            root: [0]
        };
    }
    else if (magic === 0xacc3a728) {
        let size = reader.loadUint(8);
        let offBytes = reader.loadUint(8);
        let cells = reader.loadUint(size * 8);
        let roots = reader.loadUint(size * 8);
        let absent = reader.loadUint(size * 8);
        let totalCellSize = reader.loadUint(offBytes * 8);
        let index = reader.loadBuffer(cells * offBytes);
        let cellData = reader.loadBuffer(totalCellSize);
        let crc32 = reader.loadBuffer(4);
        if (!(0, crc32c_1.crc32c)(src.subarray(0, src.length - 4)).equals(crc32)) {
            throw Error('Invalid CRC32C');
        }
        return {
            size,
            offBytes,
            cells,
            roots,
            absent,
            totalCellSize,
            index,
            cellData,
            root: [0]
        };
    }
    else if (magic === 0xb5ee9c72) {
        let hasIdx = reader.loadUint(1);
        let hasCrc32c = reader.loadUint(1);
        let hasCacheBits = reader.loadUint(1);
        let flags = reader.loadUint(2);
        let size = reader.loadUint(3);
        let offBytes = reader.loadUint(8);
        let cells = reader.loadUint(size * 8);
        let roots = reader.loadUint(size * 8);
        let absent = reader.loadUint(size * 8);
        let totalCellSize = reader.loadUint(offBytes * 8);
        let root = [];
        for (let i = 0; i < roots; i++) {
            root.push(reader.loadUint(size * 8));
        }
        let index = null;
        if (hasIdx) {
            index = reader.loadBuffer(cells * offBytes);
        }
        let cellData = reader.loadBuffer(totalCellSize);
        if (hasCrc32c) {
            let crc32 = reader.loadBuffer(4);
            if (!(0, crc32c_1.crc32c)(src.subarray(0, src.length - 4)).equals(crc32)) {
                throw Error('Invalid CRC32C');
            }
        }
        return {
            size,
            offBytes,
            cells,
            roots,
            absent,
            totalCellSize,
            index,
            cellData,
            root
        };
    }
    else {
        throw Error('Invalid magic');
    }
}
exports.parseBoc = parseBoc;
function deserializeBoc(src) {
    let boc = parseBoc(src);
    let reader = new BitReader_1.BitReader(new BitString_1.BitString(boc.cellData, 0, boc.cellData.length * 8));
    let cells = [];
    for (let i = 0; i < boc.cells; i++) {
        let cll = readCell(reader, boc.size);
        cells.push({ ...cll, result: null });
    }
    for (let i = cells.length - 1; i >= 0; i--) {
        if (cells[i].result) {
            throw Error('Impossible');
        }
        let refs = [];
        for (let r of cells[i].refs) {
            if (!cells[r].result) {
                throw Error('Invalid BOC file');
            }
            refs.push(cells[r].result);
        }
        cells[i].result = new Cell_1.Cell({ bits: cells[i].bits, refs, exotic: cells[i].exotic });
    }
    let roots = [];
    for (let i = 0; i < boc.root.length; i++) {
        roots.push(cells[boc.root[i]].result);
    }
    return roots;
}
exports.deserializeBoc = deserializeBoc;
function writeCellToBuilder(cell, refs, sizeBytes, to) {
    let d1 = (0, descriptor_1.getRefsDescriptor)(cell.refs, cell.mask.value, cell.type);
    let d2 = (0, descriptor_1.getBitsDescriptor)(cell.bits);
    to.writeUint(d1, 8);
    to.writeUint(d2, 8);
    to.writeBuffer((0, paddedBits_1.bitsToPaddedBuffer)(cell.bits));
    for (let r of refs) {
        to.writeUint(r, sizeBytes * 8);
    }
}
function serializeBoc(root, opts) {
    let allCells = (0, topologicalSort_1.topologicalSort)(root);
    let cellsNum = allCells.length;
    let has_idx = opts.idx;
    let has_crc32c = opts.crc32;
    let has_cache_bits = false;
    let flags = 0;
    let sizeBytes = Math.max(Math.ceil((0, bitsForNumber_1.bitsForNumber)(cellsNum, 'uint') / 8), 1);
    let totalCellSize = 0;
    let index = [];
    for (let c of allCells) {
        let sz = calcCellSize(c.cell, sizeBytes);
        totalCellSize += sz;
        index.push(totalCellSize);
    }
    let offsetBytes = Math.max(Math.ceil((0, bitsForNumber_1.bitsForNumber)(totalCellSize, 'uint') / 8), 1);
    let totalSize = (4 +
        1 +
        1 +
        3 * sizeBytes +
        offsetBytes +
        1 * sizeBytes +
        (has_idx ? cellsNum * offsetBytes : 0) +
        totalCellSize +
        (has_crc32c ? 4 : 0)) * 8;
    let builder = new BitBuilder_1.BitBuilder(totalSize);
    builder.writeUint(0xb5ee9c72, 32);
    builder.writeBit(has_idx);
    builder.writeBit(has_crc32c);
    builder.writeBit(has_cache_bits);
    builder.writeUint(flags, 2);
    builder.writeUint(sizeBytes, 3);
    builder.writeUint(offsetBytes, 8);
    builder.writeUint(cellsNum, sizeBytes * 8);
    builder.writeUint(1, sizeBytes * 8);
    builder.writeUint(0, sizeBytes * 8);
    builder.writeUint(totalCellSize, offsetBytes * 8);
    builder.writeUint(0, sizeBytes * 8);
    if (has_idx) {
        for (let i = 0; i < cellsNum; i++) {
            builder.writeUint(index[i], offsetBytes * 8);
        }
    }
    for (let i = 0; i < cellsNum; i++) {
        writeCellToBuilder(allCells[i].cell, allCells[i].refs, sizeBytes, builder);
    }
    if (has_crc32c) {
        let crc32 = (0, crc32c_1.crc32c)(builder.buffer());
        builder.writeBuffer(crc32);
    }
    let res = builder.buffer();
    if (res.length !== totalSize / 8) {
        throw Error('Internal error');
    }
    return res;
}
exports.serializeBoc = serializeBoc;
//# sourceMappingURL=serialization.js.map