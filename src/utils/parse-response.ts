import { prismaClient } from "../db";

interface Contact {
  id: number,
  email: string,
  phoneNumber: string,
  linkPrecedence: "PRIMARY" | "SECONDARY"
}

/*
 * Parses an array of contacts into json response
 * */
export function parseRespone(contacts: any) : object {
  let primarayContactId: number = 0;
  const emails: string[] = [];
  const phoneNumbers: string[] = [];
  const secondaryContactIds: number[] = [];

  for (let contact of contacts) {
    if (contact.linkPrecedence === "PRIMARY") primarayContactId = contact.id;
    else secondaryContactIds.push(contact.id);
    emails.push(contact.email);
    phoneNumbers.push(contact.phoneNumber);
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
