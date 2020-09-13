"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishWithFetch = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
function publishWithFetch(photo, caption, header) {
    return __awaiter(this, void 0, void 0, function () {
        var upload_id, upload, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    upload_id = Date.now();
                    return [4 /*yield*/, node_fetch_1.default("https://www.instagram.com/rupload_igphoto/fb_uploader_" + upload_id, {
                            headers: {
                                accept: "*/*",
                                "accept-language": "zh-TW,zh;q=0.9,en;q=0.8",
                                "content-type": "image/jpeg",
                                "content-length": "" + photo.byteLength,
                                origin: "https://www.instagram.com",
                                "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
                                offset: "0",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "x-csrftoken": "" + header.csrftoken,
                                "x-entity-length": "" + photo.byteLength,
                                "x-entity-name": "fb_uploader_" + upload_id,
                                "x-entity-type": "image/jpeg",
                                "x-ig-app-id": "1217981644879628",
                                "x-ig-www-claim": "" + header.claim,
                                "x-instagram-ajax": "a1de4804d095",
                                "x-instagram-rupload-params": "{\"media_type\":1,\"upload_id\":\"" + upload_id + "\",\"upload_media_height\":1080,\"upload_media_width\":1080}",
                                "x-requested-with": "XMLHttpRequest",
                                cookie: header.cookie,
                            },
                            method: "POST",
                            body: photo,
                        })];
                case 1:
                    upload = _a.sent();
                    return [4 /*yield*/, upload.json()];
                case 2:
                    res = _a.sent();
                    console.log(res);
                    if ("upload_id" in res) {
                        node_fetch_1.default("https://www.instagram.com/create/configure/", {
                            headers: {
                                accept: "*/*",
                                "accept-language": "zh-TW,zh;q=0.9,en;q=0.8",
                                "content-type": "application/x-www-form-urlencoded",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "x-csrftoken": "" + header.csrftoken,
                                "x-ig-app-id": "1217981644879628",
                                "x-ig-www-claim": "" + header.claim,
                                "x-instagram-ajax": "a1de4804d095",
                                "x-requested-with": "XMLHttpRequest",
                                origin: "https://www.instagram.com",
                                "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
                                cookie: header.cookie,
                            },
                            method: "POST",
                            body: "upload_id=" + upload_id + "&caption=" + caption + "&usertags=&custom_accessibility_caption=&retry_timeout=",
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.publishWithFetch = publishWithFetch;
