import { createServerFn } from "@tanstack/react-start";
import { IPageHistory } from "../../../../../features/pages/IPageHistory";
import { revalidateWikiPages } from "../../../../../utils/RevalidateWikiPages";

export const restorePageFromDiff = createServerFn({ method: 'POST' })
    .inputValidator((data: { diffID: string }) => data)
    .handler(async ({ data }) => {
    const { diffID } = data;
    const { createSupbaseServerClient } = await import("../../../../../supabase-server");
    const supabase = await createSupbaseServerClient();
	const { data: sessionData } = await supabase.auth.getSession();
    const isLoggedIn = sessionData.session !== null;
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

    return { redirectTo: '/' + history.page };
});