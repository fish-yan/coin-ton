"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputeError = void 0;
class ComputeError extends Error {
    constructor(message, exitCode, opts) {
        super(message);
        this.exitCode = exitCode;
        this.debugLogs = opts && opts.debugLogs ? opts.debugLogs : null;
        this.logs = opts && opts.logs ? opts.logs : null;
        Object.setPrototypeOf(this, ComputeError.prototype);
    }
}
exports.ComputeError = ComputeError;
//# sourceMappingURL=ComputeError.js.map