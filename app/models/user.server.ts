import { db } from "./db.server";

export function getUserById(id: string) {
  return db.person.findFirst({
    where: {
      id: Number(id),
    },
  });
}
