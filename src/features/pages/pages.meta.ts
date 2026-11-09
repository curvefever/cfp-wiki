import type { Page } from "./pages.types";

export const WIKI_SITE_NAME = "CF Wiki";
export const WIKI_SITE_URL = "https://wiki.curvefever.pro";
export const WIKI_IMAGE_URL = `${WIKI_SITE_URL}/banner.png`;
export const WIKI_SOCIAL_IMAGE_WIDTH = "1640";
export const WIKI_SOCIAL_IMAGE_HEIGHT = "720";
export const WIKI_HOME_DESCRIPTION =
  "The official Curve Fever Pro wiki. The ultimate game guide where you can find all the information you need to know about Curve Fever.";

const MAX_DESCRIPTION_LENGTH = 220;
const CONTENT_LINE_COUNT = 3;

export function getHomePageMeta() {
  return getSocialMeta({
    title: "Curve Fever Pro Wiki",
    description: WIKI_HOME_DESCRIPTION,
    url: WIKI_SITE_URL,
  });
}

export function getWikiPageMeta(page: Page | null | undefined) {
  if (!page) {
    return {
      title: `${WIKI_SITE_NAME} | Page not found`,
      description: "",
      meta: [
        { title: `${WIKI_SITE_NAME} | Page not found` },
        { name: "description", content: "" },
        { name: "robots", content: "noindex, follow" },
      ],
    };
  }

  const description = getPageDescription(page);
  const title = `${page.title} | Curve Fever Pro Wiki`;

  return {
    title,
    description,
    meta: [
      { title },
      { name: "description", content: description },
      ...getSocialMeta({
        title,
        description,
        url: `${WIKI_SITE_URL}/${page.slug}`,
      }),
    ],
  };
}

function getSocialMeta({
  description,
  title,
  url,
}: {
  description: string;
  title: string;
  url: string;
}) {
  return [
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: WIKI_SITE_NAME },
    { property: "og:image", content: WIKI_IMAGE_URL },
    { property: "og:image:width", content: WIKI_SOCIAL_IMAGE_WIDTH },
    { property: "og:image:height", content: WIKI_SOCIAL_IMAGE_HEIGHT },
    { property: "og:locale", content: "en_US" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: WIKI_IMAGE_URL },
  ];
}

function getPageDescription(page: Page) {
  const explicitDescription = page.description.trim();
  if (explicitDescription.length > 0) {
    return truncateDescription(explicitDescription);
  }

  const contentDescription = page.content
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map(stripMarkdownLine)
    .filter(
      (line) => line.length > 0 && line.toLowerCase() !== page.title.toLowerCase(),
    )
    .slice(0, CONTENT_LINE_COUNT)
    .join(" ");

  return truncateDescription(contentDescription);
}

function stripMarkdownLine(line: string) {
  return line
    .trim()
    .replace(/^#{1,6}\s+/, "")
    .replace(/^>\s?/, "")
    .replace(/^[-*+]\s+/, "")
    .replace(/^\d+\.\s+/, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateDescription(description: string) {
  if (description.length <= MAX_DESCRIPTION_LENGTH) {
    return description;
  }

  const truncated = description.slice(0, MAX_DESCRIPTION_LENGTH - 1).trimEnd();
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex <= MAX_DESCRIPTION_LENGTH * 0.6) {
    return `${truncated}...`;
  }

  return `${truncated.slice(0, lastSpaceIndex)}...`;
}
