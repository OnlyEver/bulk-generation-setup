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
exports.insertSourceTypology = insertSourceTypology;
exports.insertCard = insertCard;
const connection_1 = require("./connection");
function insertSourceTypology(parsedTypology, sourceId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Inserting typology');
        console.log(parsedTypology);
        const doc = {
            _source_id: sourceId,
            typology: parsedTypology,
        };
        const db = (0, connection_1.database)();
        const typologyCollection = db.collection("_typology");
        const result = yield typologyCollection.insertOne(doc);
        console.log(result);
    });
}
function insertCard(parsedCardData, sourceId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Inserting card data');
        const doc = {
            _source_id: sourceId,
            content: parsedCardData.content,
            concepts: parsedCardData.concepts,
            facts: parsedCardData.facts,
            display_title: parsedCardData.displayTitle,
            bloom_level: parsedCardData.bloomlevel,
            heading: parsedCardData.heading,
        };
        const db = (0, connection_1.database)();
        const cardCollection = db.collection("_card");
        const result = yield cardCollection.insertOne(doc);
        console.log(result);
    });
}
