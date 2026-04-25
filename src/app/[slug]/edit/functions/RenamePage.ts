import { createServerFn } from "@tanstack/react-start";
import { canAuthEditWiki } from "../../../../features/auth/auth.shared";
import { IPage } from "../../../../features/pages/IPage";
import { revalidateWikiPages } from "../../../../utils/RevalidateWikiPages";

const slugRegex = /^[a-z-]+$/;

export const renamePage = createServerFn({ method: 'POST' })
    .inputValidator((data: { pageSlug: string; newPageSlug: string }) => data)
    .handler(async ({ data }) => {
    const { pageSlug } = data;
    let { newPageSlug } = data;
    newPageSlug = newPageSlug.toLowerCase();
    if (newPageSlug.length === 0) {
        return { error: 'Slug cannot be empty' };
    }
    if (!slugRegex.test(newPageSlug)) {
        return { error: 'Slug can only contain regular characters and dashes (-)' };
    }

    const { getRequestAuthSnapshot } = await import('../../../../features/auth/server/request-auth-snapshot.server');
    const auth = await getRequestAuthSnapshot();
    if (!canAuthEditWiki(auth)) {
        return { error: 'You do not have permission to edit the wiki' };
    }

    const { createSupbaseServerClient } = await import("../../../../supabase-server");
    const supabase = await createSupbaseServerClient();

    // Change the page slug
	const postRes = await supabase.from('pages').update({ slug: newPageSlug }).eq('slug', pageSlug);
    if (postRes.error) {
        return { error: postRes.error.message };
    }

    // Update all links in other pages
    const pagesRes = await supabase.from('pages').select();
    const updatePromises = [];
    if (pagesRes.data) {
        const pages = pagesRes.data as IPage[];
        for (const page of pages) {
            if (page.next_link === pageSlug) {
                updatePromises.push(supabase.from('pages').update({ next_link: newPageSlug }).eq('slug', newPageSlug));
            }
            if (page.content.indexOf(`](/${pageSlug}`) !== -1) {
                const newContent = page.content.replace(new RegExp(`\\]\\(/${pageSlug}`, 'g'), `](/${newPageSlug}`);
                updatePromises.push(supabase.from('pages').update({ content: newContent }).eq('slug', newPageSlug));
            }
        }
    }
    await Promise.all(updatePromises);

    revalidateWikiPages([pageSlug, newPageSlug]);

    return { success: true };
});