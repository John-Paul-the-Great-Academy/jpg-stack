import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { FormStrategy } from "remix-auth-form";
import { EmailLinkStrategy } from "remix-auth-email-link";
import {
  createUser,
  getUserByEmail,
  User as TUser,
} from "~/models/user.server";
import { sessionStorage } from "~/services/session.server";
import invariant from "tiny-invariant";
import { sendEmail } from "./email.server";
import { UserType } from "@prisma/client";

if (
  typeof process.env.GOOGLE_AUTH_CLIENT_ID !== "string" ||
  typeof process.env.GOOGLE_AUTH_CLIENT_SECRET !== "string" ||
  typeof process.env.GOOGLE_AUTH_CALLBACK_URL !== "string"
) {
  throw new Error("Set the Google Auth settings in env.");
}
if (typeof process.env.SESSION_SECRET !== "string") {
  throw new Error("Session secret must be set in env.");
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<TUser>(sessionStorage);

let googleFacultyStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile

    const user = await getUserByEmail(profile.emails[0].value);
    if (!user) throw new Error("Email Not Found");
    return user;
  }
);
let googleAdminStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile

    const user = await getUserByEmail(profile.emails[0].value);
    if (profile.emails[0].value === "cbaker@jpgacademy.org") {
      return await createUser(profile.emails[0].value, UserType.ADMIN);
    }
    if (!user) throw new Error("Email Not Found");
    return user;
  }
);

let googleStudentStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    const user = await getUserByEmail(profile.emails[0].value);
    if (!user) throw new Error("Email Not Found");
    return user;
  }
);

let userEmailStrategy = new FormStrategy(async ({ form }) => {
  // Here you can use `form` to access and input values from the form.
  // and also use `context` to access more things from the server
  let email = form.get("email"); // or email... etc

  // You can validate the inputs however you want
  invariant(typeof email === "string", "email must be a string");
  invariant(email.length > 0, "email must not be empty");

  // And finally, you can find, or create, the user
  try {
    const user = await getUserByEmail(email);
    if (!user) throw new Error("Email Not Found");
    return user;
  } catch (err) {
    throw new Error("Email not found.");
  }
});

let userEmailLinkStrategy = new EmailLinkStrategy(
  {
    verifyEmailAddress: async (email) => {
      const user = await getUserByEmail(email);
      if (!user) {
        throw new Error("Email not found.");
      }
    },
    sendEmail,
    secret: process.env.SESSION_SECRET,
    callbackURL: "/auth/magic",
  },
  // In the verify callback you will only receive the email address and you
  // should return the user instance
  async ({ email }: { email: string }) => {
    let user = await getUserByEmail(email);
    if (!user) throw new Error("Email Not Found");
    return user;
  }
);

export const AUTHENTICATE_STRATEGY_GOOGLE_FACULTY = "google-faculty";
export const AUTHENTICATE_STRATEGY_GOOGLE_STUDENT = "google-student";
export const AUTHENTICATE_STRATEGY_EMAIL_FORM = "email-form";
export const AUTHENTICATE_STRATEGY_EMAIL_LINK = "email-link";
export const AUTHENTICATE_STRATEGY_GOOGLE_ADMIN = "google-admin";

// Test to see if we should implement based on some setting
authenticator.use(googleFacultyStrategy, AUTHENTICATE_STRATEGY_GOOGLE_FACULTY);
authenticator.use(googleStudentStrategy, AUTHENTICATE_STRATEGY_GOOGLE_STUDENT);
authenticator.use(userEmailStrategy, AUTHENTICATE_STRATEGY_EMAIL_FORM);
authenticator.use(userEmailLinkStrategy, AUTHENTICATE_STRATEGY_EMAIL_LINK);
authenticator.use(googleAdminStrategy, AUTHENTICATE_STRATEGY_GOOGLE_ADMIN);
