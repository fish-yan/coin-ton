"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMode = void 0;
var SendMode;
(function (SendMode) {
    SendMode[SendMode["CARRY_ALL_REMAINING_BALANCE"] = 128] = "CARRY_ALL_REMAINING_BALANCE";
    SendMode[SendMode["CARRY_ALL_REMAINING_INCOMING_VALUE"] = 64] = "CARRY_ALL_REMAINING_INCOMING_VALUE";
    SendMode[SendMode["DESTROY_ACCOUNT_IF_ZERO"] = 32] = "DESTROY_ACCOUNT_IF_ZERO";
    SendMode[SendMode["PAY_GAS_SEPARATELY"] = 1] = "PAY_GAS_SEPARATELY";
    SendMode[SendMode["IGNORE_ERRORS"] = 2] = "IGNORE_ERRORS";
    SendMode[SendMode["NONE"] = 0] = "NONE";
})(SendMode = exports.SendMode || (exports.SendMode = {}));
//# sourceMappingURL=SendMode.js.map