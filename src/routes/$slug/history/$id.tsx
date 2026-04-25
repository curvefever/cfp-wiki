import { createFileRoute, redirect } from "@tanstack/react-router";
import { PageHistoryDiff } from "../../../features/pages/components/history/PageHistoryDiff";
import { getPageHistoryDiffData } from "../../../features/pages/server/pages.server-fns";

export const Route = createFileRoute("/$slug/history/$id")({
  loader: async ({ params }) => {
    const data = await getPageHistoryDiffData({ data: { id: params.id } });
    if (!data.history) {
      throw redirect({ to: "/$slug/history", params: { slug: params.slug } });
    }

    return data;
  },
  component: HistoryDiffRoute,
});

function HistoryDiffRoute() {
  const data = Route.useLoaderData();

  return <PageHistoryDiff data={data} />;
}
