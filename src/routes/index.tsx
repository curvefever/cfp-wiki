import { createFileRoute } from "@tanstack/react-router";
import { WikiPage } from "../features/pages/components/wiki/WikiPage";
import { getHomePageMeta } from "../features/pages/pages.meta";
import { getWikiPageData } from "../features/pages/server/pages.server-fns";

export const Route = createFileRoute("/")({
  loader: () => getWikiPageData({ data: { slug: "home" } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `CF Wiki | ${loaderData?.page?.title || "Page not found"}` },
      { name: "description", content: loaderData?.page?.description || "" },
      ...getHomePageMeta(),
    ],
  }),
  component: HomeRoute,
});

function HomeRoute() {
  const data = Route.useLoaderData();

  return <WikiPage data={data} pageSlug="home" />;
}
