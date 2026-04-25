import { Outlet, createFileRoute, useMatches } from "@tanstack/react-router";
import { WikiPage } from "../features/pages/components/wiki/WikiPage";
import { getWikiPageData } from "../features/pages/server/pages.server-fns";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => getWikiPageData({ data: { slug: params.slug } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `CF Wiki | ${loaderData?.page?.title || "Page not found"}` },
      { name: "description", content: loaderData?.page?.description || "" },
    ],
  }),
  component: WikiRoute,
});

function WikiRoute() {
  const matches = useMatches();
  const leafRouteId = matches[matches.length - 1]?.routeId;

  if (leafRouteId !== Route.id) {
    return <Outlet />;
  }

  const { slug } = Route.useParams();
  const data = Route.useLoaderData();

  return <WikiPage data={data} pageSlug={slug} />;
}
