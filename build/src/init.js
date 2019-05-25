"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var boksi_conf_json_1 = __importDefault(require("../boksi-conf.json"));
var Boksi_1 = __importDefault(require("./Boksi"));
var boksi = new Boksi_1.default(boksi_conf_json_1.default);
