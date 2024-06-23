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
const contact_service_1 = require("./../utils/contact-service");
const get_contacts_1 = require("./../utils/get-contacts");
const check_imposter_1 = require("../utils/check-imposter");
exports.identifyRouter = (0, express_1.Router)();
exports.identifyRouter.post("/identify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestBody = req.body;
    requestBody.phoneNumber = requestBody.phoneNumber ? String(requestBody.phoneNumber) : null;
    let contacts;
    if (!requestBody.phoneNumber && !requestBody.email) {
        return res.status(400).json({
            "msg": "Bad request body, both arguments can not be null!"
        });
    }
    else {
        if (requestBody.email && requestBody.phoneNumber) {
            let imposters = yield (0, check_imposter_1.checkImposter)(db_1.prismaClient, requestBody.email, requestBody.phoneNumber);
            if (imposters)
                yield (0, contact_service_1.convertImposterContact)(db_1.prismaClient, imposters);
        }
        contacts = yield (0, get_contacts_1.getContacts)(db_1.prismaClient, requestBody.email, requestBody.phoneNumber);
    }
    if (contacts.length === 0 && requestBody.email && requestBody.phoneNumber) {
        let newContact = yield (0, contact_service_1.createContact)(db_1.prismaClient, requestBody.email, requestBody.phoneNumber);
        let responseBody = (0, parse_response_1.parseRespone)([newContact]);
        return res.json(responseBody);
    }
    const primaryContact = contacts.find((c) => c.linkPrecedence === "PRIMARY");
    const isNewEmail = contacts.every((c) => c.email !== requestBody.email);
    const isNewPhoneNumber = contacts.every((c) => c.phoneNumber !== requestBody.phoneNumber);
    let contactRecords = [];
    // check for new customer information
    if ((isNewEmail || isNewPhoneNumber) && requestBody.email && requestBody.phoneNumber) {
        let newContact = yield (0, contact_service_1.createSecondaryContact)(db_1.prismaClient, primaryContact, requestBody.email, requestBody.phoneNumber);
        contacts.push(newContact);
    }
    for (let contact of contacts) {
        if (contact.linkPrecedence === "PRIMARY")
            contactRecords.unshift(contact);
        else
            contactRecords.push(contact);
    }
    let responseBody = (0, parse_response_1.parseRespone)(contactRecords);
    return res.json(responseBody);
}));
