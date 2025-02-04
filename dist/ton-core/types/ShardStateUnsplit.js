"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadShardStateUnsplit = void 0;
const MasterchainStateExtra_1 = require("./MasterchainStateExtra");
const ShardAccounts_1 = require("./ShardAccounts");
const ShardIdent_1 = require("./ShardIdent");
function loadShardStateUnsplit(cs) {
    if (cs.loadUint(32) !== 0x9023afe2) {
        throw Error('Invalid data');
    }
    let globalId = cs.loadInt(32);
    let shardId = (0, ShardIdent_1.loadShardIdent)(cs);
    let seqno = cs.loadUint(32);
    let vertSeqNo = cs.loadUint(32);
    let genUtime = cs.loadUint(32);
    let genLt = cs.loadUintBig(64);
    let minRefMcSeqno = cs.loadUint(32);
    cs.loadRef();
    let beforeSplit = cs.loadBit();
    let shardAccountsRef = cs.loadRef();
    let accounts = undefined;
    if (!shardAccountsRef.isExotic) {
        accounts = (0, ShardAccounts_1.loadShardAccounts)(shardAccountsRef.beginParse());
    }
    cs.loadRef();
    let mcStateExtra = cs.loadBit();
    let extras = null;
    if (mcStateExtra) {
        let cell = cs.loadRef();
        if (!cell.isExotic) {
            extras = (0, MasterchainStateExtra_1.loadMasterchainStateExtra)(cell.beginParse());
        }
    }
    ;
    return {
        globalId,
        shardId,
        seqno,
        vertSeqNo,
        genUtime,
        genLt,
        minRefMcSeqno,
        beforeSplit,
        accounts,
        extras
    };
}
exports.loadShardStateUnsplit = loadShardStateUnsplit;
//# sourceMappingURL=ShardStateUnsplit.js.map