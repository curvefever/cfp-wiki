export async function createPage(slug: string) {
    return { redirectTo: `/${slug}/edit` };
}