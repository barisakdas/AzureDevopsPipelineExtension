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
var tl = require("azure-pipelines-task-lib/task");
var jira_client_1 = __importDefault(require("jira-client"));
// ## İşimizi halledecek bir fonksiyona ihtiyacımız var.
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var branchName, jiraAdminUserName, jiraAdminUserPassword, userName, projectName, reviewController, transactionId, adminUser, adminPass, issueKey, jiraUrl, bodyText, jira, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    branchName = tl.getVariable("Build.SourceBranchName");
                    jiraAdminUserName = tl.getVariable("JIRA.USERNAME");
                    jiraAdminUserPassword = tl.getVariable("JIRA.PASSWORD");
                    userName = tl.getVariable("Jira.DomainUsername");
                    projectName = (_a = tl
                        .getInput("projectName", true)) === null || _a === void 0 ? void 0 : _a.toUpperCase();
                    reviewController = tl.getInput("reviewController", false);
                    transactionId = 231;
                    adminUser = jiraAdminUserName ? jiraAdminUserName : "";
                    adminPass = jiraAdminUserPassword ? jiraAdminUserPassword : "";
                    if (branchName === null || branchName === void 0 ? void 0 : branchName.includes("merge")) {
                        branchName = tl.getVariable("System.PullRequest.SourceBranch");
                        transactionId = 241; // Buradaki id `Test In Review` adımına gidecek transactionun id si olacak.
                        userName = reviewController ? reviewController : "DTBULCAN";
                    }
                    console.log("branch: ", branchName);
                    issueKey = branchName
                        ? projectName + "-" + (branchName === null || branchName === void 0 ? void 0 : branchName.split("-", 3)[1].split(".", 1)[0])
                        : "";
                    console.log("issueKey: ", issueKey);
                    jiraUrl = "https://jira.digiturk.com.tr/rest/api/2/issue/" +
                        issueKey +
                        "/transitions";
                    bodyText = "";
                    jira = new jira_client_1.default({
                        protocol: "https",
                        host: "jira.digiturk.com.tr",
                        username: adminUser,
                        password: adminPass,
                        apiVersion: "2",
                        strictSSL: true,
                    });
                    //#endregion JiraApi Connection
                    bodyText =
                        "{\n        \"transition\": {\n            \"id\": \"" +
                            transactionId +
                            "\"\n        },\n        \"assignee\": {\n            \"name\": \"" +
                            userName +
                            "\"\n        }\n    }\n";
                    console.log("bodyTesxt: ", bodyText);
                    return [4 /*yield*/, jiraChangeStatu(bodyText, adminUser, adminPass, jiraUrl)];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _b.sent();
                    tl.setResult(tl.TaskResult.Failed, err_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function jiraChangeStatu(bodyText, jiraAdminUserName, jiraAdminUserPassword, jiraUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var fetch, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetch = require("node-fetch");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log("#### START API Post - Change Statu of Issue ####");
                    return [4 /*yield*/, fetch(jiraUrl, {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json;charset=UTF-8",
                                Authorization: "Basic " +
                                    Buffer.from(jiraAdminUserName + ":" + jiraAdminUserPassword).toString("base64"),
                            },
                            body: bodyText,
                        })];
                case 2:
                    response = _a.sent();
                    console.log("#### END API Post - Change Statu of Issue ####");
                    console.log("response: ", response);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    tl.setResult(tl.TaskResult.Failed, error_1.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Yukarda oluşturulan fonksiyonu burada çağırıyoruz
run();
