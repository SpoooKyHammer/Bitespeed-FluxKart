"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRespone = parseRespone;
/*
 * Parses an array of contacts into json response
 * */
function parseRespone(contacts) {
    let primarayContactId = 0;
    const emails = [];
    const phoneNumbers = [];
    const secondaryContactIds = [];
    for (let contact of contacts) {
        if (contact.linkPrecedence === "PRIMARY")
            primarayContactId = contact.id;
        else
            secondaryContactIds.push(contact.id);
        let email = contact.email;
        if (email && !emails.includes(email)) {
            emails.push(email);
        }
        let phoneNumber = contact.phoneNumber;
        if (phoneNumber && !phoneNumbers.includes(phoneNumber)) {
            phoneNumbers.push(phoneNumber);
        }
    }
    return {
        "contact": {
            "primarayContactId": primarayContactId,
            "emails": emails,
            "phoneNumbers": phoneNumbers,
            "secondaryContactIds": secondaryContactIds
        }
    };
}
