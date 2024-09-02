import Page from "./[slug]/page";

export default async function Home() {
    return Page({ params: { slug: 'home' } });
}