// root.tsx
import React, { useContext, useEffect } from "react";
import { withEmotionCache } from "@emotion/react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { MetaFunction, LinksFunction } from "@remix-run/node"; // Depends on the runtime you choose

import { ServerStyleContext, ClientStyleContext } from "./context";

const theme = extendTheme({
  colors: {
    gray: {
      50: "#fceff2",
      100: "#ddd7d9",
      200: "#c1bfbf",
      300: "#a6a6a6",
      400: "#8c8c8c",
      500: "#737373",
      600: "#595959",
      700: "#413f40",
      800: "#292526",
      900: "#16090d",
    },
    blue: {
      50: "#e8efff",
      100: "#c0d0f2",
      200: "#98b1e6",
      300: "#6e92dc",
      400: "#4772d2",
      500: "#3059b9",
      600: "#244591",
      700: "#193167",
      800: "#0d1e3f",
      900: "#010a19",
    },
    yellow: {
      50: "#fff9dc",
      100: "#ffeeaf",
      200: "#fee280",
      300: "#fdd74e",
      400: "#fdcb20",
      500: "#e3b208",
      600: "#b18a02",
      700: "#7e6300",
      800: "#4d3b00",
      900: "#1b1400",
    },

    red: {
      50: "#ffe9e6",
      100: "#f3c5c0",
      200: "#e69f98",
      300: "#db7a70",
      400: "#d05447",
      500: "#b73b2e",
      600: "#8f2e24",
      700: "#672019",
      800: "#3f120e",
      900: "#1b0301",
    },
    orange: {
      "50": "#FEF0E6",
      "100": "#FDD4BA",
      "200": "#FBB88D",
      "300": "#FA9C61",
      "400": "#F88035",
      "500": "#F76408",
      "600": "#C55007",
      "700": "#943C05",
      "800": "#632803",
      "900": "#311402",
    },
  },
});

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export let links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstaticom" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
    },
  ];
};

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Outlet />
      </ChakraProvider>
    </Document>
  );
}
