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
exports.identifyRouter = void 0;
const express_1 = require("express");
const db_1 = require("./../db");
const parse_response_1 = require("./../utils/parse-response");
exports.identifyRouter = (0, express_1.Router)();
exports.identifyRouter.post("/identify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestBody = req.body;
    if (!requestBody.phoneNumber && !requestBody.email) {
        return res.status(400).json({
            "msg": "Bad request body, both arguments can not be null!"
        });
    }
    const query = {};
    if (requestBody.phoneNumber)
        query.phoneNumber = String(requestBody.phoneNumber);
    if (requestBody.email)
        query.email = requestBody.email;
    const customerRecords = yield db_1.prismaClient.contact.findMany({
        where: query
    });
    if (customerRecords.length !== 0) {
        let responseBody = (0, parse_response_1.parseRespone)(customerRecords);
        console.table(customerRecords);
        return res.json(responseBody);
    }
    else {
        const customerRecord = yield db_1.prismaClient.contact.create({
            data: {
                email: requestBody.email,
                phoneNumber: String(requestBody.phoneNumber),
                linkPrecedence: "PRIMARY",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    }
}));
