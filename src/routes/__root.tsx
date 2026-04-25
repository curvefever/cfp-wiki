/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import PopupProvider from "../components/overlays/PopupProvider";
import { AuthProvider } from "../features/auth/components/AuthProvider";
import { getInitialAuth } from "../features/auth/server/auth.server-fns";
import asapRegularWoff2 from "../assets/fonts/asap-regular-webfont.woff2?url";
import asapSemiboldWoff2 from "../assets/fonts/asap-semibold-webfont.woff2?url";
import asapBoldWoff2 from "../assets/fonts/asap-bold-webfont.woff2?url";
import "../styles/globals.css";
import "../styles/markdown.css";

export const Route = createRootRoute({
  loader: () => getInitialAuth(),
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
      {
        rel: "preload",
        href: asapRegularWoff2,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: asapSemiboldWoff2,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: asapBoldWoff2,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const initialAuth = Route.useLoaderData();

  return (
    <RootDocument>
      <AuthProvider initialAuth={initialAuth}>
        <PopupProvider>
          <Outlet />
        </PopupProvider>
      </AuthProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const criticalHeadStyles = `
    :root {
      --font-asap: "Asap", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    }

    html,
    body {
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-asap);
      background: #153c58;
      color: #ffffff;
    }
  `;

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalHeadStyles }} />
        <HeadContent />
      </head>
      <body className="font-asap flex flex-col min-h-[100vh] overflow-x-hidden bg-bg text-text">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
