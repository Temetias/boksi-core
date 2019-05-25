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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var BloksHandler_1 = __importDefault(require("../blok-handler/BloksHandler"));
var LogMember_1 = __importDefault(require("../log/LogMember"));
/**
 *
 */
var Core = /** @class */ (function (_super) {
    __extends(Core, _super);
    /**
     *
     */
    function Core(config) {
        var _this = _super.call(this, "Core") || this;
        /**
         *
         */
        _this.requestHandler = function (request, response) {
            response.end("Hello from Boksi!\n\nCurrently available bloks:\n" + _this.bloksHandler.getBloks().map(function (blok) { return blok.name; }));
        };
        _this.log("Initializing core...");
        _this.config = config.coreConfig;
        _this.bloksHandler = new BloksHandler_1.default(config.bloksConfig);
        _this.server = _this.buildServer();
        _this.startServer();
        return _this;
    }
    /**
     *
     */
    Core.prototype.buildServer = function () {
        var server = http_1.createServer(this.requestHandler);
        return server;
    };
    /**
     *
     */
    Core.prototype.startServer = function () {
        var port = process.env.NODE_ENV === "production"
            ? this.config.port
            : this.config.devPort;
        this.server.listen(port);
        this.log("Boksi is listening on port " + port + " in " + process.env.NODE_ENV + " mode.");
    };
    return Core;
}(LogMember_1.default));
exports.default = Core;
