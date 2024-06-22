import { Router, Request, Response } from "express";

import { prismaClient } from "./../db";
import { parseRespone } from "./../utils/parse-response"

interface RequestBody {
  email?: string | null,
  phoneNumber?: string | null
}

export const identifyRouter = Router();

identifyRouter.post("/identify", async (req: Request, res: Response) => {

  const requestBody: RequestBody = req.body;
  
  if (!requestBody.phoneNumber && !requestBody.email) {
    return res.status(400).json({
      "msg": "Bad request body, both arguments can not be null!"
    });
  }

  const query: RequestBody = {};
  
  if (requestBody.phoneNumber) query.phoneNumber =  String(requestBody.phoneNumber);
  if (requestBody.email) query.email = requestBody.email;

  const customerRecords = await prismaClient.contact.findMany({
    where: query
  });

  if (customerRecords.length !== 0) {
    let responseBody = parseRespone(customerRecords);
    console.table(customerRecords);
    return res.json(responseBody);
  } else {
    const customerRecord = await prismaClient.contact.create({
      data: {
        email: requestBody.email,
        phoneNumber: String(requestBody.phoneNumber),
        linkPrecedence: "PRIMARY",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

});
