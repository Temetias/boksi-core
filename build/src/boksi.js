"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var boksi_conf_json_1 = __importDefault(require("../boksi-conf.json"));
var Core_1 = __importDefault(require("./core/Core"));
var core = new Core_1.default(boksi_conf_json_1.default);
var emitter = new events_1.EventEmitter();
emitter.emit("test");
exports.default = { emitter: emitter };
