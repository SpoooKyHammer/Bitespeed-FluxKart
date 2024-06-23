import { Contact, PrismaClient } from "@prisma/client";

/*
 * Gets all contacts i.e primary and secondary contacts by primaryContactId.*/
async function getAllContacts(prismaClient: PrismaClient, primaryContactId: number) : Promise<Contact[]> {
  let contacts = await prismaClient.contact.findMany({
    where: {
      OR: [
        {linkedId: primaryContactId},
        {id: primaryContactId}
      ]
    }
  });
  return contacts;
}

/*
 * Gets all contact from database that matchs with either email or phoneNumber or both.*/
export async function getContacts(prismaClient: PrismaClient, email: string | null, phoneNumber: string | null) : Promise<Contact[]> {
  let contact: Contact | null = null;

  if (email && phoneNumber) {  
    contact = await prismaClient.contact.findFirst({
      where: {
        OR: [
          { email: email, phoneNumber: phoneNumber },
          { email: email },
          { phoneNumber: phoneNumber }
        ]
      }
    });
  } else if (email && !phoneNumber) {
    contact = await prismaClient.contact.findFirst({where: { email: email } });
  } else if (!email && phoneNumber) {
    contact = await prismaClient.contact.findFirst({where: { phoneNumber: phoneNumber } });
  }
  
  if (!contact) {
    return [];
  }

  const primarContactId = contact.linkPrecedence === "PRIMARY" ? contact.id : contact.linkedId;
  const contacts = await getAllContacts(prismaClient, primarContactId!);
  return contacts;
}
