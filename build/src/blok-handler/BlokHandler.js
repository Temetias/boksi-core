"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var LogMember_1 = __importDefault(require("../log/LogMember"));
var patterns_1 = require("../utils/patterns");
var Blok_1 = __importDefault(require("./Blok"));
/**
 *
 */
var BloksHandler = /** @class */ (function (_super) {
    __extends(BloksHandler, _super);
    /**
     *
     */
    function BloksHandler(config) {
        var _this = _super.call(this, "BlokHandler") || this;
        /**
         *
         */
        _this.bloks = [];
        _this.log("Initializing blok-handler...");
        _this.config = config;
        var blokDirs = _this.getBlokDirs();
        var blokBuildPromises = blokDirs.map(function (blokDir) { return _this.buildBlok(blokDir); });
        Promise.all(blokBuildPromises)
            .then(function () { return _this.bloks.forEach(function (blok) { return blok.init(); }); })
            .catch(function (buildError) { return _this.log("One or more of the blok builds failed! Theres propably more information above.", buildError); });
        return _this;
    }
    /**
     *
     */
    BloksHandler.prototype.getBlokDirs = function () {
        if (this.config.bloksDir) {
            return this.getBlokDirsFromDir(this.config.bloksDir);
        }
        else {
            this.log("No blok-directory set in boksi-conf.json!");
            return [];
        }
    };
    /**
     *
     */
    BloksHandler.prototype.getBlokDirsFromDir = function (dir) {
        var isDirectory = function (source) { return fs_1.lstatSync(source).isDirectory(); };
        var bloksDir = path_1.join(__dirname, "../../../", dir);
        return fs_1.readdirSync(bloksDir)
            .map(function (name) { return path_1.join(bloksDir, name); })
            .filter(isDirectory);
    };
    /**
     *
     */
    BloksHandler.prototype.buildBlok = function (blokDir) {
        return __awaiter(this, void 0, void 0, function () {
            var blokConfigPath, _a, confError, config, blok, _b, buildError, status;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        blokConfigPath = path_1.join(blokDir, "blok-conf.json");
                        return [4 /*yield*/, patterns_1.safely(Promise.resolve().then(function () { return __importStar(require(blokConfigPath)); }))];
                    case 1:
                        _a = __read.apply(void 0, [_c.sent(), 2]), confError = _a[0], config = _a[1];
                        if (confError) {
                            this.log("Could not locate blok-conf.json from " + blokDir + " thus blok not added to blok-runtime!", confError);
                            return [2 /*return*/];
                        }
                        if (!config.name) {
                            this.log("No name given for blok in blok-conf.json at " + blokDir + " thus blok not added to blok-runtime!");
                            return [2 /*return*/];
                        }
                        blok = new Blok_1.default(config, blokDir);
                        return [4 /*yield*/, patterns_1.safely(blok.build())];
                    case 2:
                        _b = __read.apply(void 0, [_c.sent(), 2]), buildError = _b[0], status = _b[1];
                        if (buildError || !status) {
                            this.log("Something went wrong building blok \"" + blok.name + "\" thus, blok not added to blok-runtime!", buildError ? buildError : "");
                            return [2 /*return*/];
                        }
                        this.bloks.push(blok);
                        return [2 /*return*/];
                }
            });
        });
    };
    return BloksHandler;
}(LogMember_1.default));
exports.default = BloksHandler;
