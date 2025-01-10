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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const send_generation_1 = require("./generation-jobs/send_generation");
const check_batch_status_1 = require("./generation-jobs/3.batch-status/check_batch_status");
const get_result_1 = require("./generation-jobs/4.batch-result/get_result");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.get("/send-generation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, send_generation_1.sendGeneration)();
    res.send(data);
}));
app.get("/check-status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const data = await checkBatchStatus("1");
    // const data = await checkBatchStatus("batch_677e2d19065081909e98849d40dd11ed");
    // const data = await checkBatchStatus("batch_677e2d19065081909e98849d40dd11ed");
    // const data = await checkBatchStatus("batch_677f8b8d58d0819090918418f0402ebb"); //card gen batch
    // const data = await checkBatchStatus("batch_6780a1bde1dc81908175ebecb7eb8756"); //card gen batch
    // const data = await checkBatchStatus("batch_6780a390f2408190b58c6a0cdfd7a686"); //card gen batch
    const data = yield (0, check_batch_status_1.checkBatchStatus)("batch_6780a5c656f081909144eea4b5fea5b5"); //card gen batch
    // batch_677d070dfd008190ad9b8a48cf6717e4
    res.send(data);
}));
app.get("/get-results", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const data = await checkBatchStatus("1");
    // const data = await getResult("file-4jyehGaJ145NnZBS5zkw2w");
    const data = yield (0, get_result_1.getResult)("file-AwS7kdAgAhczAKHSa5QobL"); //card gen batch
    // const data = await getResult("file-AFf7HYu9brVBKGhBRgrv5h"); //card gen batch
    // batch_677d070dfd008190ad9b8a48cf6717e4
    res.send(data);
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
