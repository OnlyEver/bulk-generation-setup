"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generation_queue_1 = require("./queue-implementation/generation-queue");
const generation_worker_1 = require("./queue-implementation/generation_worker");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Hello, world!");
});
app.get("/send-generation", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, send_generation_1.sendGeneration)();
    res.send(data);
  })
);
app.get("/check-status", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // const data = await checkBatchStatus("1");
    const data = yield (0, check_batch_status_1.checkBatchStatus)(
      "batch_677d070c405881909d5c6373fea1ab91"
    );
    // batch_677d070dfd008190ad9b8a48cf6717e4
    res.send(data);
  })
);
app.get("/get-results", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // const data = await checkBatchStatus("1");
    const data = yield (0, get_result_1.getResult)(
      "batch_677d070c405881909d5c6373fea1ab91"
    );
    // batch_677d070dfd008190ad9b8a48cf6717e4
    res.send(data);
  })
);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
