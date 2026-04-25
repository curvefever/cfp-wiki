import { Outlet, createFileRoute, useMatches } from "@tanstack/react-router";
import PageHistory, { getPageHistoryData } from "../../app/[slug]/history/page";

export const Route = createFileRoute("/$slug/history")({
  loader: ({ params }) => getPageHistoryData({ data: { slug: params.slug } }),
  component: HistoryRoute,
});

function HistoryRoute() {
  const matches = useMatches();
  const leafRouteId = matches[matches.length - 1]?.routeId;

  if (leafRouteId !== Route.id) {
    return <Outlet />;
  }

  const { slug } = Route.useParams();
  const data = Route.useLoaderData();

  return <PageHistory data={data} pageSlug={slug} />;
}
