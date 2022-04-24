import type { User, Person } from "@prisma/client";
import { db } from "../services/db.server";

import { UserType } from "@prisma/client";

type UserWithPerson = User & { person: Person };
export type { UserWithPerson as User };

export async function createUser(email: string, type: UserType) {
  const person = await db.person.findFirst({
    where: {
      email,
    },
  });
  if (!person) throw Error("Person does not exist.");
  return db.user.upsert({
    where: {
      factsId: person.id,
    },
    create: {
      email,
      person: {
        connect: {
          id: person.id,
        },
      },
      type,
    },
    update: {
      type,
    },
    include: {
      person: true,
    },
  });
}

export function getUserByEmail(email: string): Promise<UserWithPerson | null> {
  return db.user.findFirst({
    where: {
      email,
    },
    include: {
      person: true,
    },
  });
}

export function getUserById(id: string) {
  return db.user.findFirst({
    where: {
      id,
    },
    include: {
      person: true,
    },
  });
}
