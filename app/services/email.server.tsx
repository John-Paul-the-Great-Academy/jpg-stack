import type { SendEmailFunction } from "remix-auth-email-link";
import type { User } from "~/models/user.server";
import { renderToString } from "react-dom/server";
import * as emailProvider from "~/services/mailgun.server";

export let sendEmail: SendEmailFunction<User> = async (options) => {
  let subject = "Here's your Magic sign-in link";
  let body = renderToString(
    <p>
      Hi {options.user?.person.firstName || "there"},<br />
      <br />
      <a href={options.magicLink}>
        Click here to login on {process.env.DEFAULT_DOMAIN}
      </a>
    </p>
  );

  if (!options.user?.email) {
    throw new Error("User has no email address");
  }
  await emailProvider.sendEmail([options.user.email], subject, body);
};
