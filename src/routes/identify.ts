import { Router, Request, Response } from "express";
import { Contact } from "@prisma/client";

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
  
  if (!requestBody.phoneNumber && !requestBody.email) {
    return res.status(400).json({
      "msg": "Bad request body, both arguments can not be null!"
    });
  }

  let contactRecord = await prismaClient.contact.findFirst({
    where: {
      OR: [
        { email: requestBody.email, phoneNumber: String(requestBody.phoneNumber) },
        { phoneNumber: String(requestBody.phoneNumber) },
        { email: requestBody.email }
      ]
    }
  });

  if (contactRecord) {
    let contactRecords: Contact[] = [];
    
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

    //to-do next requirement But what happens if there are no existing contacts against an incoming request?
  // const contactRecords: Contact[] = [];
  // let contactRecordByEmail = await prismaClient.contact.findFirst({where: {email: requestBody.email} });
  // 
  // if (contactRecordByEmail) {
  //   let responseBody = parseRespone([contactRecordByEmail]);
  //   console.table(responseBody);
  //
  // }
  //
  // let contactRecordByPhoneNumber = await prismaClient.contact.findFirst({where: {phoneNumber: String(requestBody.phoneNumber)} });
  // const linkPrecedence: LinkPrecedence = contactRecordByEmail || contactRecordByPhoneNumber ? "SECONDARY" : "PRIMARY";
  // let linkedId: number | null = null;
  //
  // switch (contactRecordByEmail?.linkPrecedence) {
  //   case "PRIMARY": {
  //     linkedId = contactRecordByEmail.id;
  //     break;
  //   }
  //   case "SECONDARY": {
  //     linkedId = contactRecordByEmail.linkedId;
  //     break;
  //   }
  // }
  //
  // switch (contactRecordByPhoneNumber?.linkPrecedence) {
  //   case "PRIMARY": {
  //     linkedId = contactRecordByPhoneNumber.id;
  //     break;
  //   }
  //   case "SECONDARY": {
  //     linkedId = contactRecordByPhoneNumber.linkedId;
  //     break;
  //   }
  // }
  //
  // let newContact = await prismaClient.contact.create({
  //   data: {
  //     email: requestBody.email,
  //     phoneNumber: String(requestBody.phoneNumber),
  //     linkPrecedence: linkPrecedence,
  //     linkedId: linkedId,
  //     createdAt: new Date(),
  //     updatedAt: new Date()
  //   }
  // });
  // 
  // contactRecords.push(newContact);
  //
  // if (contactRecordByEmail) contactRecords.push(contactRecordByEmail);
  // if (contactRecordByPhoneNumber) contactRecords.push(contactRecordByPhoneNumber);
  // let responseBody = parseRespone(contactRecords);
  // console.table(contactRecords);
  // res.json(responseBody);

});
