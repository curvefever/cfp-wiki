import { createServerFn } from "@tanstack/react-start";
import { IPage } from "../../../../features/pages/IPage";
import { revalidateWikiPages } from "../../../../utils/RevalidateWikiPages";

export const saveEditorChanges = createServerFn({ method: 'POST' })
    .inputValidator((data: { page: IPage; content: string; summary: string; user: string }) => data)
    .handler(async ({ data }) => {
    const { page, content, summary, user } = data;

    if (summary.length === 0) {
        return { error: 'Summary cannot be empty' };
    }
    
    const { createSupbaseServerClient } = await import("../../../../supabase-server");
    const supabase = await createSupbaseServerClient();
	const { data: sessionData } = await supabase.auth.getSession();
    const isLoggedIn = sessionData.session !== null;
    if (!isLoggedIn) {
        return { error: 'You must be logged in' };
    }

    const updateRes = await supabase.from('pages').upsert({ ...page, content });
    if (updateRes.error) {
        return { error: updateRes.error.message };
    }

    const insertRes = await supabase.from('page_history').insert({ page: page.slug, user, edit_summary: summary, content_before: page.content, content_after: content });
    if (insertRes.error) {
        return { error: insertRes.error.message };
    }

    revalidateWikiPages([page.slug]);

    return { redirectTo: '/' + page.slug };
});