import { Contact } from "@prisma/client"

interface ResponseContact {
  primarayContactId: number,
  emails: string[],
  phoneNumbers: string[],
  secondaryContactIds: number[]
}

export interface ResponseBody {
  contact: ResponseContact
}

/*
 * Parses an array of contacts into json response
 * */
export function parseRespone(contacts: Contact[]) : ResponseBody {
  let primarayContactId: number = 0;
  const emails: string[] = [];
  const phoneNumbers: string[] = [];
  const secondaryContactIds: number[] = [];

  for (let contact of contacts) {
    if (contact.linkPrecedence === "PRIMARY") primarayContactId = contact.id;
    else secondaryContactIds.push(contact.id);

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
