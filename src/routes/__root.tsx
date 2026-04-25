/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import Popups from "../app/Popups";
import "../app/globals.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CF Wiki" },
      {
        name: "description",
        content:
          "The official Curve Fever Pro wiki. The ultimate game guide where you can find all the information you need to know about Curve Fever.",
      },
      { name: "application-name", content: "CF Wiki" },
      { name: "referrer", content: "origin-when-cross-origin" },
      {
        name: "keywords",
        content:
          "curvefever, curve fever pro, curve fever wiki, curve wiki, cf wiki, cfp wiki, wiki, wikipedia, guide, knowledgebase",
      },
      { name: "creator", content: "Curve Fever Pro" },
      { name: "publisher", content: "Curve Fever Pro" },
      { property: "og:title", content: "CF Wiki" },
      {
        property: "og:description",
        content:
          "The official Curve Fever Pro wiki. The ultimate game guide where you can find all the information you need to know about Curve Fever.",
      },
      { property: "og:url", content: "https://wiki.curvefever.pro" },
      { property: "og:site_name", content: "CF Wiki" },
      { property: "og:image", content: "https://wiki.curvefever.pro/icon.png" },
      { property: "og:locale", content: "en_US" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/icon.png" },
      { rel: "shortcut icon", href: "/icon.png" },
      { rel: "apple-touch-icon", href: "/apple-icon.png" },
      { rel: "apple-touch-icon-precomposed", href: "/icon.png" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Popups>
        <Outlet />
      </Popups>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-asap flex flex-col min-h-[100vh] overflow-x-hidden bg-bg text-text">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
