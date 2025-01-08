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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generationWorker = void 0;
const bullmq_1 = require("bullmq");
const generation_process_js_1 = require("./generation-process.js");
exports.generationWorker = new bullmq_1.Worker("generation-queue", (job) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Generation job started", job.id);
    yield (0, generation_process_js_1.generationProcess)(job);
}), {
    connection: {
        host: "127.0.0.1",
        port: 6379,
    },
});
