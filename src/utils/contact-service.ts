import { Contact, PrismaClient } from "@prisma/client";

/*
 * Creates a new Contact record in database. 
 * */
export async function createContact(prismaClient: PrismaClient, email: string, phoneNumber: string) : Promise<Contact> {
  let contactRecord = await prismaClient.contact.create({
    data: {
      email: email,
      phoneNumber: phoneNumber,
      linkPrecedence: "PRIMARY",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  
  return contactRecord;
}

/*
 * Creates a new Contact record in database and marks it as secondary contact and links it to it's primary contact record.
 * */
export async function createSecondaryContact(prismaClient: PrismaClient, primaryContact: Contact, email: string, phoneNumber: string) : Promise<Contact> {
  let linkedId = primaryContact.linkPrecedence === "PRIMARY" ? primaryContact.id : primaryContact.linkedId;
  let contactRecord = await prismaClient.contact.create({
    data: {
      email: email,
      phoneNumber: phoneNumber,
      linkPrecedence: "SECONDARY",
      linkedId: linkedId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  return contactRecord;
}


/*
 * Converts imposter contact to secondary contact
 * (aka links imposter contact with respective contact)
 * */
export async function convertImposterContact(prismaClient: PrismaClient, contacts: Contact[]) : Promise<void> {
  let primaryContact = contacts.find((c => c.linkPrecedence === "PRIMARY")) as Contact;
  
  for (let contact of contacts) {
    if (contact.id === primaryContact.id) continue;

    await prismaClient.contact.update({
      where: { id: contact.id }, 
      data: { linkPrecedence: "SECONDARY", linkedId: primaryContact.id }
    });
  }
}
