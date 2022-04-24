import { Person } from "@prisma/client";
import { Twilio } from "twilio";
import { User } from "~/models/user.server";
import { db } from "~/services/db.server";
import { getSetting } from "~/models/settings.server";
import { sendEmail } from "./mailgun.server";

if (
  typeof process.env.TWILIO_ACCOUNT_SID !== "string" ||
  typeof process.env.TWILIO_AUTH_TOKEN !== "string" ||
  typeof process.env.TWILIO_PHONE_NUMBER !== "string"
) {
  throw new Error("Set the Twilio Auth settings in env.");
}

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID as string;
  const authToken = process.env.TWILIO_AUTH_TOKEN as string;
  return new Twilio(sid, authToken);
}

export async function getBalance() {
  const client = getClient();
  return await client.balance.fetch();
}

async function sendIndividualMessage(
  to: string,
  groupName: string,
  message: string
) {
  const client = getClient();
  const { sid } = await client.messages.create({
    to, // put phone here
    from: process.env.TWILIO_PHONE_NUMBER,
    body: `${groupName}:
${message}`,
  });
  return sid;
}

// export async function sendMessage({
//   message,
//   user,
//   recipients,
//   isEmailed = false,
//   group,
// }: {
//   message: string;
//   user: User;
//   recipients: {
//     name: string;
//     id: string;
//     cells: Pick<Person, "id" | "cellPhone">[];
//   }[];
//   isEmailed: boolean;
//   group: string;
// }) {
//   const sender = await getPerson(user.id);
//   const headers = await getSetting<{ name: string; value: string }[]>(
//     "headers"
//   );
//   if (!headers) return false;
//   if (!sender?.cellPhone) return false;

//   await Promise.all(
//     recipients.flatMap(async ({ name, id, cells }) => {
//       const ids = await Promise.all(
//         cells.slice(0, 1).flatMap(async ({ cellPhone, id }) => {
//           return await sendIndividualMessage(
//             sender.cellPhone,
//             headers.filter((h) => h.name === name)[0].value,
//             message
//           );
//         })
//       );

//       if (isEmailed) {
//         const ids = recipients.flatMap((r) => r.cells.map(({ id }) => id));
//         const emails = await getEmails(ids);
//         await sendEmail(
//           [user.email], // TODO: replace with emails after testing
//           "JPG Announcement",
//           `${message}
// ${emails}`
//         );
//       }

//       await saveMessage({
//         senderId: user.id,
//         isEmailed,
//         messageIds: ids,
//         recipientIds: recipients.flatMap((group) =>
//           group.cells.flatMap(({ id }) => id)
//         ),
//         text: message,
//         group: name,
//       });
//     })
//   );
// }

export async function getMessageStatus(messageId: string) {
  const client = getClient();
  const result = await client.messages.get(messageId).fetch();
  return { result };
}

export async function getMessageSuccessCount() {
  const client = getClient();
  const list = await client.messages.list();
  const successes = list.filter(
    (m) => m.status === "delivered" || m.status === "sent"
  ).length;
  const failures = list.filter(
    (m) => m.status === "failed" || m.status === "undelivered"
  ).length;
  const cost = list?.find((l) => l.price !== null)?.price || 0;
  return { successes, failures, total: list.length, cost };
}

//--------- UTILS ---------//
export const cleanCell = (cell: string) => {
  if (cell.trim() === "") return "";
  const removedDashes = cell
    .split(/[- ]/)
    .join("")
    .replace(/[\(\)]/gi, "");
  // add +1
  return removedDashes[0] === "1" ? `+${removedDashes}` : `+1${removedDashes}`;
};
