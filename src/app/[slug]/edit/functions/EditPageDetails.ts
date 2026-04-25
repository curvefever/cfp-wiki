import { createServerFn } from "@tanstack/react-start";
import { canAuthEditWiki } from "../../../../features/auth/auth.shared";
import { revalidateWikiPages } from "../../../../utils/RevalidateWikiPages";

interface IPageDetails {
    title: string;
    description: string;
    next_link: string;
}

export const editPageDetails = createServerFn({ method: 'POST' })
    .inputValidator((data: { pageSlug: string; details: IPageDetails }) => data)
    .handler(async ({ data }) => {
    const { pageSlug, details } = data;

    if (details.title.length === 0) {
        return { error: 'Title cannot be empty' };
    }
    if (details.description.length === 0) {
        return { error: 'Description cannot be empty' };
    }

    const { getRequestAuthSnapshot } = await import('../../../../features/auth/server/request-auth-snapshot.server');
    const auth = await getRequestAuthSnapshot();
    if (!canAuthEditWiki(auth)) {
        return { error: 'You do not have permission to edit the wiki' };
    }

    const { createSupbaseServerClient } = await import("../../../../supabase-server");
    const supabase = await createSupbaseServerClient();

	const postRes = await supabase.from('pages').update({ title: details.title, description: details.description, next_link: details.next_link }).eq('slug', pageSlug);
    if (postRes.error) {
        return { error: postRes.error.message };
    }

    revalidateWikiPages([pageSlug]);

    return { success: true };
});