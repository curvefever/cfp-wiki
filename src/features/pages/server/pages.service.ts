import { canAuthEditWiki, type AuthSnapshot } from "../../auth/auth.shared";
import { revalidateWikiPages } from "../../../utils/RevalidateWikiPages";
import type { Page, PageDetails } from "../pages.types";
import { renderMarkdownContent } from "./pages.markdown.server";
import {
  getAllPages,
  getEditablePageBySlug,
  getPageHistory,
  getPageHistoryEntry,
  getPublicPageBySlug,
  insertPageHistory,
  updatePageContent,
  updatePageDetails as updatePageDetailsRecord,
  updatePageNextLink,
  updatePageSlug,
  upsertPage,
} from "./pages.repository";

const slugRegex = /^[a-z-]+$/;

export async function getWikiPageData(slug: string) {
  const page = await getPublicPageBySlug(slug);

  return {
    page,
    htmlContent: page ? await renderMarkdownContent(page.content) : "",
  };
}

export async function getEditPageData(slug: string, auth: AuthSnapshot) {
  if (!canAuthEditWiki(auth)) {
    return { auth, page: null };
  }

  const page = (await getEditablePageBySlug(slug)) || createDraftPage(slug);
  return { auth, page };
}

export async function getPageHistoryData(slug: string, auth: AuthSnapshot) {
  if (!canAuthEditWiki(auth)) {
    return { auth, history: undefined };
  }

  return { auth, history: await getPageHistory(slug) };
}

export async function getPageHistoryDiffData(id: string, auth: AuthSnapshot) {
  if (!canAuthEditWiki(auth)) {
    return { auth, history: undefined };
  }

  return { auth, history: await getPageHistoryEntry(id) };
}

export async function savePageContent({
  auth,
  content,
  page,
  summary,
}: {
  auth: AuthSnapshot;
  content: string;
  page: Page;
  summary: string;
}) {
  if (summary.length === 0) {
    return { error: "Summary cannot be empty" };
  }

  if (!canAuthEditWiki(auth)) {
    return { error: "You do not have permission to edit the wiki" };
  }

  const updateResult = await upsertPage({ ...page, content });
  if (updateResult.error) {
    return { error: updateResult.error.message };
  }

  const insertResult = await insertPageHistory({
    page: page.slug,
    user: auth.username || "unknown",
    edit_summary: summary,
    content_before: page.content,
    content_after: content,
  });
  if (insertResult.error) {
    return { error: insertResult.error.message };
  }

  revalidateWikiPages([page.slug]);
  return { redirectTo: `/${page.slug}` };
}

export async function savePageDetails({
  auth,
  details,
  pageSlug,
}: {
  auth: AuthSnapshot;
  details: PageDetails;
  pageSlug: string;
}) {
  if (details.title.length === 0) {
    return { error: "Title cannot be empty" };
  }

  if (details.description.length === 0) {
    return { error: "Description cannot be empty" };
  }

  if (!canAuthEditWiki(auth)) {
    return { error: "You do not have permission to edit the wiki" };
  }

  const result = await updatePageDetailsRecord(pageSlug, details);
  if (result.error) {
    return { error: result.error.message };
  }

  revalidateWikiPages([pageSlug]);
  return { success: true };
}

export async function renameWikiPage({
  auth,
  newPageSlug,
  pageSlug,
}: {
  auth: AuthSnapshot;
  newPageSlug: string;
  pageSlug: string;
}) {
  const normalizedSlug = newPageSlug.toLowerCase();

  if (normalizedSlug.length === 0) {
    return { error: "Slug cannot be empty" };
  }

  if (!slugRegex.test(normalizedSlug)) {
    return { error: "Slug can only contain regular characters and dashes (-)" };
  }

  if (!canAuthEditWiki(auth)) {
    return { error: "You do not have permission to edit the wiki" };
  }

  const renameResult = await updatePageSlug(pageSlug, normalizedSlug);
  if (renameResult.error) {
    return { error: renameResult.error.message };
  }

  const changedPageSlugs = new Set([pageSlug, normalizedSlug]);
  const pages = await getAllPages();
  const updatePromises = pages.flatMap((page) => {
    const updates = [];

    if (page.next_link === pageSlug) {
      updates.push(updatePageNextLink(page.slug, normalizedSlug));
      changedPageSlugs.add(page.slug);
    }

    if (page.content.includes(`](/${pageSlug}`)) {
      const content = page.content.replace(
        new RegExp(`\\]\\(/${pageSlug}`, "g"),
        `](/${normalizedSlug}`,
      );
      updates.push(updatePageContent(page.slug, content));
      changedPageSlugs.add(page.slug);
    }

    return updates;
  });

  const updateResults = await Promise.all(updatePromises);
  const failedUpdate = updateResults.find((result) => result.error);
  if (failedUpdate?.error) {
    return { error: failedUpdate.error.message };
  }

  revalidateWikiPages([...changedPageSlugs]);
  return { success: true };
}

export async function restorePageFromHistory({
  auth,
  historyId,
}: {
  auth: AuthSnapshot;
  historyId: string;
}) {
  if (!canAuthEditWiki(auth)) {
    return { error: "You do not have permission to edit the wiki" };
  }

  const history = await getPageHistoryEntry(historyId);
  if (!history) {
    return { error: "History entry not found" };
  }

  const result = await updatePageContent(history.page, history.content_before);
  if (result.error) {
    return { error: result.error.message };
  }

  revalidateWikiPages([history.page]);
  return { redirectTo: `/${history.page}` };
}

function createDraftPage(slug: string): Page {
  return {
    slug,
    title: slug,
    description: slug,
    next_link: "",
    content: "",
  };
}