#! /usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var moment_1 = __importDefault(require("moment"));
var exifr_1 = __importDefault(require("exifr"));
var sharp_1 = __importDefault(require("sharp"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var aspect = require("aspectratio");
var node_geocoder_1 = __importDefault(require("node-geocoder"));
var instagram_private_api_1 = require("instagram-private-api");
var fakeig_1 = require("./fakeig");
var DEBUG = false;
var DELAY_SEC = 2;
var IG_Portrait_Aspect_Ratio = "4:5";
var EXTENSION = ".jpg";
var FOLDER = path_1.default.resolve("./img/");
var FOLDER_ED = path_1.default.join(FOLDER, "ed");
fs_1.default.existsSync(FOLDER_ED) || fs_1.default.mkdirSync(FOLDER_ED, { recursive: true });
var geocoder = node_geocoder_1.default({ provider: "openstreetmap", language: "en" });
var ig = new instagram_private_api_1.IgApiClient();
ig.state.generateDevice((_a = process.env.IG_USERNAME) !== null && _a !== void 0 ? _a : "");
function login() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ig.simulate.preLoginFlow()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, ig.account.login((_a = process.env.IG_USERNAME) !== null && _a !== void 0 ? _a : "", (_b = process.env.IG_PASSWORD) !== null && _b !== void 0 ? _b : "")];
                case 2:
                    _c.sent();
                    process.nextTick(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, ig.simulate.postLoginFlow()];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); });
                    return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var files, filesInfo, _i, _a, _b, key, info, photo, caption, res, img, _c, _d, width, height, crop, err_1;
    var _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _h.trys.push([0, 20, , 21]);
                files = fs_1.default
                    .readdirSync(FOLDER)
                    .filter(function (file) { return path_1.default.extname(file).toLowerCase() === EXTENSION; })
                    .map(function (file) { return path_1.default.join(FOLDER, file); });
                return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(void 0, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, exifr_1.default.parse(file, [
                                        "DateTimeOriginal",
                                        "Model",
                                        "GPSLatitude",
                                        "GPSLongitude",
                                    ])];
                                case 1:
                                    res = _a.sent();
                                    return [2 /*return*/, __assign(__assign({}, res), { file: file })];
                            }
                        });
                    }); }))];
            case 1:
                filesInfo = _h.sent();
                filesInfo.sort(function (prev, next) {
                    var _a, _b;
                    return new Date((_a = prev.DateTimeOriginal) !== null && _a !== void 0 ? _a : 0).getTime() -
                        new Date((_b = next.DateTimeOriginal) !== null && _b !== void 0 ? _b : 1).getTime();
                });
                if (!!DEBUG) return [3 /*break*/, 3];
                return [4 /*yield*/, login()];
            case 2:
                _h.sent();
                _h.label = 3;
            case 3:
                _i = 0, _a = Object.entries(filesInfo);
                _h.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 19];
                _b = _a[_i], key = _b[0], info = _b[1];
                photo = Buffer.alloc(0);
                caption = "";
                if (info.DateTimeOriginal)
                    caption += "#" + moment_1.default(info.DateTimeOriginal).format("YYYYMMDD");
                if (!(info.latitude && info.longitude)) return [3 /*break*/, 6];
                return [4 /*yield*/, geocoder.reverse({
                        lat: info.latitude,
                        lon: info.longitude,
                    })];
            case 5:
                res = _h.sent();
                if (res[0])
                    caption += " #" + res[0].city;
                _h.label = 6;
            case 6:
                if (info.Model)
                    caption += " (" + info.Model + ")";
                console.log(path_1.default.basename(info.file) + " (" + (parseInt(key) + 1) + "/" + filesInfo.length + ")");
                _c = sharp_1.default;
                return [4 /*yield*/, sharp_1.default(info.file).rotate().toBuffer()];
            case 7:
                img = _c.apply(void 0, [_h.sent()]);
                return [4 /*yield*/, img.metadata()];
            case 8:
                _d = _h.sent(), width = _d.width, height = _d.height;
                if (!(width && height && width < height)) return [3 /*break*/, 10];
                crop = aspect.crop(width, height, IG_Portrait_Aspect_Ratio);
                return [4 /*yield*/, img
                        .extract({
                        left: crop[0],
                        top: crop[1],
                        width: crop[2],
                        height: crop[3],
                    })
                        .jpeg({ quality: 90 })
                        .toBuffer()];
            case 9:
                photo = _h.sent();
                return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, img.jpeg({ quality: 95 }).toBuffer()];
            case 11:
                photo = _h.sent();
                _h.label = 12;
            case 12:
                if (!!DEBUG) return [3 /*break*/, 14];
                return [4 /*yield*/, ig.publish.photo({ file: photo, caption: caption })];
            case 13:
                _h.sent();
                return [3 /*break*/, 16];
            case 14: return [4 /*yield*/, fakeig_1.publishWithFetch(photo, caption, {
                    cookie: (_e = process.env.cookie) !== null && _e !== void 0 ? _e : "",
                    csrftoken: (_f = process.env.csrftoken) !== null && _f !== void 0 ? _f : "",
                    claim: (_g = process.env.claim) !== null && _g !== void 0 ? _g : "",
                })];
            case 15:
                _h.sent();
                _h.label = 16;
            case 16:
                fs_1.default.renameSync(info.file, path_1.default.join(FOLDER_ED, path_1.default.basename(info.file)));
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000 * DELAY_SEC); })];
            case 17:
                _h.sent();
                _h.label = 18;
            case 18:
                _i++;
                return [3 /*break*/, 4];
            case 19:
                console.log("Finished.");
                return [3 /*break*/, 21];
            case 20:
                err_1 = _h.sent();
                console.log(err_1);
                return [3 /*break*/, 21];
            case 21: return [2 /*return*/];
        }
    });
}); })();
