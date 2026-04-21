'use server';
import { redirect } from "next/navigation";
import { IPage } from "../../../../features/pages/IPage";
import { createSupbaseServerClient } from "../../../../supabase-server";
import { revalidateWikiPages } from "../../../../utils/RevalidateWikiPages";

export async function saveEditorChanges(page: IPage, content: string, summary: string, user: string) {
    if (summary.length === 0) {
        return { error: 'Summary cannot be empty' };
    }
    
    const supabase = await createSupbaseServerClient();
	const { data } = await supabase.auth.getSession();
    const isLoggedIn = data.session !== null;
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

    return redirect('/' + page.slug);
}