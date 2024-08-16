'use server'

import { IPage } from "../../../../features/pages/IPage";
import { createSupbaseServerClient } from "../../../../supabase-server";

const slugRegex = /^[a-z-]+$/;

export async function renamePage(pageSlug: string, newPageSlug: string) {
    newPageSlug = newPageSlug.toLowerCase();
    if (newPageSlug.length === 0) {
        return { error: 'Slug cannot be empty' };
    }
    if (!slugRegex.test(newPageSlug)) {
        return { error: 'Slug can only contain regular characters and dashes (-)' };
    }

    const supabase = await createSupbaseServerClient();
	const { data } = await supabase.auth.getSession();
    const isLoggedIn = data.session !== null;
    if (!isLoggedIn) {
        return { error: 'You must be logged in' };
    }

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
            if (page.content.indexOf(`](/${pageSlug}`) == -1) {
                continue;
            }
            const newContent = page.content.replace(new RegExp(`\\]\\(/${pageSlug}`, 'g'), `](/${newPageSlug}`);
            updatePromises.push(supabase.from('pages').update({ content: newContent }).eq('slug', newPageSlug));
        }
    }
    await Promise.all(updatePromises);

    return { success: true };
}