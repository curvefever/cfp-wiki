import { createSupbasePublicClient } from "../../../supabase-public";
import { createSupbaseServerClient } from "../../../supabase-server";
import type { Page, PageDetails, PageHistoryEntry } from "../pages.types";

export async function getPublicPageBySlug(slug: string) {
  const supabase = createSupbasePublicClient();
  const result = await supabase
    .from("pages")
    .select("slug,title,description,next_link,content")
    .eq("slug", slug)
    .single();

  return result.data as Page | null;
}

export async function getEditablePageBySlug(slug: string) {
  const supabase = await createSupbaseServerClient();
  const result = await supabase.from("pages").select().eq("slug", slug).single();

  return result.data as Page | null;
}

export async function upsertPage(page: Page) {
  const supabase = await createSupbaseServerClient();
  return supabase.from("pages").upsert(page);
}

export async function updatePageDetails(slug: string, details: PageDetails) {
  const supabase = await createSupbaseServerClient();
  return supabase
    .from("pages")
    .update({
      title: details.title,
      description: details.description,
      next_link: details.next_link,
    })
    .eq("slug", slug);
}

export async function updatePageSlug(pageSlug: string, newPageSlug: string) {
  const supabase = await createSupbaseServerClient();
  return supabase.from("pages").update({ slug: newPageSlug }).eq("slug", pageSlug);
}

export async function getAllPages() {
  const supabase = await createSupbaseServerClient();
  const result = await supabase.from("pages").select();

  return result.data ? (result.data as Page[]) : [];
}

export async function updatePageNextLink(slug: string, nextLink: string) {
  const supabase = await createSupbaseServerClient();
  return supabase.from("pages").update({ next_link: nextLink }).eq("slug", slug);
}

export async function updatePageContent(slug: string, content: string) {
  const supabase = await createSupbaseServerClient();
  return supabase.from("pages").update({ content }).eq("slug", slug);
}

export async function insertPageHistory(entry: {
  page: string;
  user: string;
  edit_summary: string;
  content_before: string;
  content_after: string;
}) {
  const supabase = await createSupbaseServerClient();
  return supabase.from("page_history").insert(entry);
}

export async function getPageHistory(pageSlug: string) {
  const supabase = await createSupbaseServerClient();
  const result = await supabase.from("page_history").select().eq("page", pageSlug);

  return result.data ? (result.data as PageHistoryEntry[]) : undefined;
}

export async function getPageHistoryEntry(id: string) {
  const supabase = await createSupbaseServerClient();
  const result = await supabase.from("page_history").select().eq("id", id).single();

  return result.data ? (result.data as PageHistoryEntry) : undefined;
}