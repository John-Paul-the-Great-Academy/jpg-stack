import { createCookieSessionStorage } from "@remix-run/node";
import { Theme, isTheme } from "~/services/theme-provider";

if (typeof process.env.SESSION_SECRET !== "string") {
  throw new Error("SESSION_SECRET must be set in the env.");
}

// export the whole sessionStorage object
export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [process.env.SESSION_SECRET], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "jpg_theme",
    secure: true,
    secrets: [process.env.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    // no theme for you on Kent's 100th birthday! 😂
    expires: new Date("2088-10-18"),
    httpOnly: true,
  },
});

export async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get("Cookie"));
  return {
    getTheme: () => {
      const themeValue = session.get("theme");
      return isTheme(themeValue) ? themeValue : Theme.DARK;
    },
    setTheme: (theme: Theme) => session.set("theme", theme),
    commit: () => themeStorage.commitSession(session),
  };
}

// you can also export the methods individually for your own usage
export let { getSession, commitSession, destroySession } = sessionStorage;
