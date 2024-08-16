'use server'

import { redirect } from "next/navigation";

export async function createPage(slug: string) {

    return redirect(`/${slug}/edit`);
}