"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
var LogMember = /** @class */ (function () {
    /**
     *
     */
    function LogMember(source) {
        this.source = source;
        // TODO: Init logging file.
    }
    /**
     *
     */
    LogMember.prototype.log = function (message, error) {
        // TODO: Log to file.
        console.log("" + new Date().toLocaleString(), "- from " + this.source + ":");
        console.log(message, error ? "Trace below:\n---\n" + error + "\n----" : "", "\n");
    };
    return LogMember;
}());
exports.default = LogMember;
