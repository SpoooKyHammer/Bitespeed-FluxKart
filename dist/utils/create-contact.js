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
exports.createContact = createContact;
exports.createSecondaryContact = createSecondaryContact;
/*
 * Creates a new Contact record in database.
 * */
function createContact(prismaClient, email, phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        let contactRecord = yield prismaClient.contact.create({
            data: {
                email: email,
                phoneNumber: phoneNumber,
                linkPrecedence: "PRIMARY",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        return contactRecord;
    });
}
/*
 * Creates a new Contact record in database and marks it as secondary contact and links it to it's primary contact record.
 * */
function createSecondaryContact(prismaClient, primaryContact, email, phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        let linkedId = primaryContact.linkPrecedence === "PRIMARY" ? primaryContact.id : primaryContact.linkedId;
        let contactRecord = yield prismaClient.contact.create({
            data: {
                email: email,
                phoneNumber: phoneNumber,
                linkPrecedence: "SECONDARY",
                linkedId: linkedId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        return contactRecord;
    });
}
