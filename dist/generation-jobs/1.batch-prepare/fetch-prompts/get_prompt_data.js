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
exports.getPromptData = getPromptData;
const connection_1 = require("../../../mongodb/connection");
const mongodb_1 = require("mongodb");
/**
 * Function for getting the `prompt` field from the `_prompts` collection
 * by passing an array of object ids
 *
 * @param promptIds - An array of string (Object Ids of the prompt documents)
 */
function getPromptData(promptIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const promptCollection = connection_1.database.collection('_prompts');
        // Convert string IDs to ObjectId
        const objectIds = promptIds.map((id) => new mongodb_1.ObjectId(id));
        let result = yield promptCollection
            .aggregate([
            {
                /// match the ids of prompt docs
                $match: {
                    _id: {
                        $in: objectIds,
                    },
                },
            },
            {
                /// create a new field allContent(in memory) and pushes the "prompt" field from _prompt doc
                $group: {
                    _id: null,
                    allContent: { $push: "$prompt" },
                },
            },
            {
                /// concat each element in above created `allContent temp field`, and update that to "concatenatedContent"(temp field)
                $project: {
                    concatenatedContent: {
                        $reduce: {
                            input: "$allContent",
                            initialValue: "",
                            in: { $concat: ["$$value", "$$this"] },
                        },
                    },
                },
            },
        ])
            .toArray();
        return result.length > 0 ? result[0].concatenatedContent : "";
    });
}
