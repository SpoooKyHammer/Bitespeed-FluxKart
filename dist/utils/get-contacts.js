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
exports.getContacts = getContacts;
/*
 * Gets all contacts i.e primary and secondary contacts by primaryContactId.
 * */
function getAllContacts(prismaClient, primaryContactId) {
    return __awaiter(this, void 0, void 0, function* () {
        let contacts = yield prismaClient.contact.findMany({
            where: {
                OR: [
                    { linkedId: primaryContactId },
                    { id: primaryContactId }
                ]
            }
        });
        return contacts;
    });
}
/*
 * Gets all contact from database that matchs with either email or phoneNumber or both.
 * */
function getContacts(prismaClient, email, phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        let contact = null;
        if (email && phoneNumber) {
            contact = yield prismaClient.contact.findFirst({
                where: {
                    OR: [
                        { email: email, phoneNumber: phoneNumber },
                        { email: email },
                        { phoneNumber: phoneNumber }
                    ]
                }
            });
        }
        else if (email && !phoneNumber) {
            contact = yield prismaClient.contact.findFirst({ where: { email: email } });
        }
        else if (!email && phoneNumber) {
            contact = yield prismaClient.contact.findFirst({ where: { phoneNumber: phoneNumber } });
        }
        if (!contact) {
            return [];
        }
        const primarContactId = contact.linkPrecedence === "PRIMARY" ? contact.id : contact.linkedId;
        const contacts = yield getAllContacts(prismaClient, primarContactId);
        return contacts;
    });
}
