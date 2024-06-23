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
exports.checkImposter = checkImposter;
/*
 * Checks if new customer detail conflicts with exisiting primary contact
 * (aka multiple unlinked contacts that atleast contains one same argument as the new customer)
 * */
function checkImposter(prismaClient, email, phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        let contacts = yield prismaClient.contact.findMany({
            where: {
                OR: [
                    { email: email, phoneNumber: phoneNumber },
                    { email: email },
                    { phoneNumber: phoneNumber }
                ]
            }
        });
        let totalPrimaryContact = 0;
        for (let contact of contacts) {
            if (contact.linkPrecedence === "PRIMARY")
                totalPrimaryContact++;
        }
        return totalPrimaryContact > 1 ? contacts : null;
    });
}
