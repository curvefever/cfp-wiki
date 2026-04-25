import { createServerFn } from "@tanstack/react-start";
import { IPage } from "../../../../features/pages/IPage";
import { canAuthEditWiki } from "../../../../features/auth/auth.shared";
import { revalidateWikiPages } from "../../../../utils/RevalidateWikiPages";

export const saveEditorChanges = createServerFn({ method: 'POST' })
    .inputValidator((data: { page: IPage; content: string; summary: string }) => data)
    .handler(async ({ data }) => {
    const { page, content, summary } = data;

    if (summary.length === 0) {
        return { error: 'Summary cannot be empty' };
    }
    
    const { getRequestAuthSnapshot } = await import('../../../../features/auth/server/request-auth-snapshot.server');
    const auth = await getRequestAuthSnapshot();
    if (!canAuthEditWiki(auth)) {
        return { error: 'You do not have permission to edit the wiki' };
    }

    const { createSupbaseServerClient } = await import("../../../../supabase-server");
    const supabase = await createSupbaseServerClient();

    const updateRes = await supabase.from('pages').upsert({ ...page, content });
    if (updateRes.error) {
        return { error: updateRes.error.message };
    }

    const insertRes = await supabase.from('page_history').insert({ page: page.slug, user: auth.username || 'unknown', edit_summary: summary, content_before: page.content, content_after: content });
    if (insertRes.error) {
        return { error: insertRes.error.message };
    }

    revalidateWikiPages([page.slug]);

    return { redirectTo: '/' + page.slug };
});