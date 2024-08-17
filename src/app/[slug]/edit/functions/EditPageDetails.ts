'use server'

import { createSupbaseServerClient } from "../../../../supabase-server";

interface IPageDetails {
    title: string;
    description: string;
    next_link: string;
}

export async function editPageDetails(pageSlug: string, details: IPageDetails) {
    if (details.title.length === 0) {
        return { error: 'Title cannot be empty' };
    }
    if (details.description.length === 0) {
        return { error: 'Description cannot be empty' };
    }

    const supabase = await createSupbaseServerClient();
	const { data } = await supabase.auth.getSession();
    const isLoggedIn = data.session !== null;
    if (!isLoggedIn) {
        return { error: 'You must be logged in' };
    }

	const postRes = await supabase.from('pages').update({ title: details.title, description: details.description, next_link: details.next_link }).eq('slug', pageSlug);
    if (postRes.error) {
        return { error: postRes.error.message };
    }
    return { success: true };
}