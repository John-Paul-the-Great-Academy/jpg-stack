if (typeof process.env.MAILGUN_API_KEY !== "string") {
  throw new Error("Mailgun API must be set in env.");
}
if (typeof process.env.MAILGUN_DOMAIN !== "string") {
  throw new Error("Mailgun domain must be set in env.");
}

const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

export const sendEmail = async (
  to: string[],
  subject: string,
  body: string
) => {
  const res = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
    to: ["cbaker@jpgacademy.org", ...to],
    from: "John Paul the Great Academy <cbaker@jpgacademy.org>",
    subject,
    html: body,
  });
  if (res.error) {
    throw new Error(res.error);
  }
  // throw new Error("IMPLEMENT sendEmail");
};
