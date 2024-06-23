import { Contact, PrismaClient } from "@prisma/client";

/*
 * Checks if new customer detail conflicts with exisiting primary contact  
 * (aka multiple unlinked contacts that atleast contains one same argument as the new customer)
 * */
export async function checkImposter(prismaClient: PrismaClient, email: string, phoneNumber: string) : Promise<Contact[] | null> {
  let contacts = await prismaClient.contact.findMany({
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
    if (contact.linkPrecedence === "PRIMARY") totalPrimaryContact++;
  }

  return totalPrimaryContact > 1 ? contacts : null;
}
