import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { data } from "msw/lib/types/context";
import { getThemeSession } from "./services/session.server";
import {
  NonFlashOfWrongThemeEls,
  ThemeProvider,
  Theme,
  useTheme,
} from "./services/theme-provider";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "APP_NAME",
  viewport: "width=device-width,initial-scale=1",
});

export type LoaderData = {
  theme: Theme | null;
  ENV: { [key: string]: string };
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  const user = await getUser(request);
  const data: LoaderData = {
    theme: themeSession.getTheme(),
    ENV: {
      BASE_URL: process.env.BASE_URL || "",
      BASE_URL2: process.env.BASE_URL2 || "",
    },
    user,
  };

  return data;
};
function App() {
  const data = useLoaderData<LoaderData>();

  const [theme] = useTheme();

  return (
    <html lang="en" className="" data-theme={theme}>
      <head>
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
      </head>
      <body className="min-h-screen bg-base-200">
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}
