'use server'

import { redirect } from "next/navigation";
import { IPageHistory } from "../../../../../features/pages/IPageHistory";
import { createSupbaseServerClient } from "../../../../../supabase-server";
import { revalidateWikiPages } from "../../../../../utils/RevalidateWikiPages";

export async function restorePageFromDiff(diffID: string) {
    const supabase = await createSupbaseServerClient();
	const { data } = await supabase.auth.getSession();
    const isLoggedIn = data.session !== null;
    if (!isLoggedIn) {
        return { error: 'You must be logged in' };
    }

	const historyRes = await supabase.from('page_history').select().eq('id', diffID).single();
    if (historyRes.error) {
        return { error: historyRes.error.message };
    }
    const history = historyRes.data as IPageHistory;

    const updateRes = await supabase.from('pages').update({ content: history.content_before }).eq('slug', history.page);
    if (updateRes.error) {
        return { error: updateRes.error.message };
    }

    revalidateWikiPages([history.page]);

    return redirect('/' + history.page);
}