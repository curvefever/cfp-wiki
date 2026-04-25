import { createFileRoute } from "@tanstack/react-router";
import { EditPage } from "../../features/pages/components/edit/EditPage";
import { getEditPageData } from "../../features/pages/server/pages.server-fns";

export const Route = createFileRoute("/$slug/edit")({
  loader: ({ params }) => getEditPageData({ data: { slug: params.slug } }),
  component: EditPageRoute,
});

function EditPageRoute() {
  const { slug } = Route.useParams();
  const data = Route.useLoaderData();

  return <EditPage data={data} pageSlug={slug} />;
}
