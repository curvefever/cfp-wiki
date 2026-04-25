import { createServerFn } from "@tanstack/react-start";
import type { Page, PageDetails } from "../pages.types";

export const getWikiPageData = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const service = await import("./pages.service");
    return service.getWikiPageData(data.slug);
  });

export const getEditPageData = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { getRequestAuthSnapshot } = await import(
      "../../auth/server/request-auth-snapshot.server"
    );
    const service = await import("./pages.service");
    return service.getEditPageData(data.slug, await getRequestAuthSnapshot());
  });

export const getPageHistoryData = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { getRequestAuthSnapshot } = await import(
      "../../auth/server/request-auth-snapshot.server"
    );
    const service = await import("./pages.service");
    return service.getPageHistoryData(data.slug, await getRequestAuthSnapshot());
  });

export const getPageHistoryDiffData = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { getRequestAuthSnapshot } = await import(
      "../../auth/server/request-auth-snapshot.server"
    );
    const service = await import("./pages.service");
    return service.getPageHistoryDiffData(data.id, await getRequestAuthSnapshot());
  });

export const saveEditorChanges = createServerFn({ method: "POST" })
  .inputValidator((data: { page: Page; content: string; summary: string }) => data)
  .handler(async ({ data }) => {
    const { getRequestAuthSnapshot } = await import(
      "../../auth/server/request-auth-snapshot.server"
    );
    const service = await import("./pages.service");
    return service.savePageContent({ ...data, auth: await getRequestAuthSnapshot() });
  });

export const editPageDetails = createServerFn({ method: "POST" })
  .inputValidator((data: { pageSlug: string; details: PageDetails }) => data)
  .handler(async ({ data }) => {
    const { getRequestAuthSnapshot } = await import(
      "../../auth/server/request-auth-snapshot.server"
    );
    const service = await import("./pages.service");
    return service.savePageDetails({ ...data, auth: await getRequestAuthSnapshot() });
  });

export const renamePage = createServerFn({ method: "POST" })
  .inputValidator((data: { pageSlug: string; newPageSlug: string }) => data)
  .handler(async ({ data }) => {
    const { getRequestAuthSnapshot } = await import(
      "../../auth/server/request-auth-snapshot.server"
    );
    const service = await import("./pages.service");
    return service.renameWikiPage({ ...data, auth: await getRequestAuthSnapshot() });
  });

export const restorePageFromDiff = createServerFn({ method: "POST" })
  .inputValidator((data: { diffID: string }) => data)
  .handler(async ({ data }) => {
    const { getRequestAuthSnapshot } = await import(
      "../../auth/server/request-auth-snapshot.server"
    );
    const service = await import("./pages.service");
    return service.restorePageFromHistory({
      auth: await getRequestAuthSnapshot(),
      historyId: data.diffID,
    });
  });