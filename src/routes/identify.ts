import { Router, Request, Response } from "express";
import { Contact, PrismaClient } from "@prisma/client";

import { prismaClient } from "./../db";
import { parseRespone } from "./../utils/parse-response";
import { createContact, createSecondaryContact } from "./../utils/create-contact";

interface RequestBody {
  email: string | null,
  phoneNumber: string | null
}

export const identifyRouter = Router();

identifyRouter.post("/identify", async (req: Request, res: Response) => {

  const requestBody: RequestBody = req.body;
  requestBody.phoneNumber = String(requestBody.phoneNumber);
  
  if (!requestBody.phoneNumber && !requestBody.email) {
    return res.status(400).json({
      "msg": "Bad request body, both arguments can not be null!"
    });
  }


  let contactRecord = await prismaClient.contact.findFirst({
    where: {
      OR: [
        { email: requestBody.email, phoneNumber: requestBody.phoneNumber },
        { phoneNumber: requestBody.phoneNumber },
        { email: requestBody.email }
      ]
    }
  });

  if (contactRecord) {
    let contactRecords: Contact[] = [];
   
    if (
      (requestBody.email && requestBody.phoneNumber) && 
      (contactRecord.email !== requestBody.email || contactRecord.phoneNumber !== requestBody.phoneNumber)
    ) {
      await createSecondaryContact(prismaClient, contactRecord, requestBody.email, requestBody.phoneNumber);
    }

    if (contactRecord.linkPrecedence === "PRIMARY") {
      contactRecords.push(contactRecord);
      let secondaryContacts = await prismaClient.contact.findMany({
        where: { linkedId: contactRecord.id }
      });
      contactRecords = contactRecords.concat(secondaryContacts);
    } else if (contactRecord.linkPrecedence === "SECONDARY" && contactRecord.linkedId){
      //could be multiple secondary, get PRIMARY and all secondary
      let primaryContact = await prismaClient.contact.findFirst({where: {id: contactRecord.linkedId}});
      
      if (primaryContact) contactRecords.push(primaryContact);
      
      let secondaryContacts = await prismaClient.contact.findMany({
        where: { linkedId: primaryContact?.id }
      });
      contactRecords = contactRecords.concat(secondaryContacts);
    }
    
    let responseBody = parseRespone(contactRecords);
    console.table(contactRecords);
    return res.json(responseBody);
  }

  if (requestBody.email && requestBody.phoneNumber) {
    let newContact = await createContact(prismaClient, requestBody.email, requestBody.phoneNumber);
    let responseBody = parseRespone([newContact]);
    console.table(newContact);
    return res.json(responseBody);
  }
});
