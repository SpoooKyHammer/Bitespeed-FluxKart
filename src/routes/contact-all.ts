import { Request, Response, Router } from "express";

import { prismaClient } from "../db";

export const contactAllRouter = Router();

contactAllRouter.get("/all", async (req: Request, res: Response) => {
  let contacts = await prismaClient.contact.findMany({});
  res.json(contacts);
})
