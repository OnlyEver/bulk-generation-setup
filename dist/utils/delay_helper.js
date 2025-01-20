"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
const delay = (seconds) => new Promise((res, rej) => setTimeout(() => res(), seconds * 1000));
exports.delay = delay;
//# sourceMappingURL=delay_helper.js.map