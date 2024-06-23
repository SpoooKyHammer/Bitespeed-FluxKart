import { Router, Request, Response } from "express";
import { Contact } from "@prisma/client";

import { prismaClient } from "./../db";
import { parseRespone } from "./../utils/parse-response";
import { createContact, createSecondaryContact, convertImposterContact } from "./../utils/contact-service";
import { getContacts } from "./../utils/get-contacts";
import { checkImposter } from "../utils/check-imposter";

interface RequestBody {
  email: string | null,
  phoneNumber: string | null
}

export const identifyRouter = Router();

identifyRouter.post("/identify", async (req: Request, res: Response) => {

  const requestBody: RequestBody = req.body;
  requestBody.phoneNumber = requestBody.phoneNumber ? String(requestBody.phoneNumber) : null;
  
  let contacts: Contact[];

  if (!requestBody.phoneNumber && !requestBody.email) {
    return res.status(400).json({
      "msg": "Bad request body, both arguments can not be null!"
    });
  } else {
    if (requestBody.email && requestBody.phoneNumber) {
      let imposters = await checkImposter(prismaClient, requestBody.email, requestBody.phoneNumber);
      if (imposters) await convertImposterContact(prismaClient, imposters);
    }
    contacts = await getContacts(prismaClient, requestBody.email, requestBody.phoneNumber);
  }
  
  if (contacts.length === 0 && requestBody.email && requestBody.phoneNumber) {
    let newContact = await createContact(prismaClient, requestBody.email, requestBody.phoneNumber);
    let responseBody = parseRespone([newContact]);
    return res.json(responseBody);
   }

  const primaryContact = contacts.find((c) => c.linkPrecedence === "PRIMARY") as Contact;
  const isNewEmail = contacts.every((c) => c.email !== requestBody.email);
  const isNewPhoneNumber = contacts.every((c) => c.phoneNumber !== requestBody.phoneNumber);

  let contactRecords: Contact[] = [];

  // check for new customer information
  if ((isNewEmail || isNewPhoneNumber) && requestBody.email && requestBody.phoneNumber) {
    let newContact = await createSecondaryContact(prismaClient, primaryContact, requestBody.email, requestBody.phoneNumber);
    contacts.push(newContact);
  }

  for (let contact of contacts) {
    if (contact.linkPrecedence === "PRIMARY") contactRecords.unshift(contact);
    else contactRecords.push(contact);
  }

  let responseBody = parseRespone(contactRecords);
  return res.json(responseBody); 
});
