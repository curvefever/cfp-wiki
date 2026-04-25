import { createServerFn } from "@tanstack/react-start";
import { IPage } from "../../../features/pages/IPage";
import { Main } from "../../../components/layout/main";
import Editor from "../../../components/editor/Editor";
import { canAuthEditWiki } from "../../../features/auth/auth.shared";

export const getEditPageData = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { getRequestAuthSnapshot } =
      await import("../../../features/auth/server/request-auth-snapshot.server");
    const auth = await getRequestAuthSnapshot();
    if (!canAuthEditWiki(auth)) {
      return { auth, page: null };
    }

    const { createSupbaseServerClient } =
      await import("../../../supabase-server");
    const supabase = await createSupbaseServerClient();
    const pageSlug = data.slug;
    const postRes = await supabase
      .from("pages")
      .select()
      .eq("slug", pageSlug)
      .single();
    const page: IPage = postRes.data || {
      slug: pageSlug,
      title: pageSlug,
      description: pageSlug,
      next_link: "",
      content: "",
    };

    return { auth, page };
  });

type EditPageData = Awaited<ReturnType<typeof getEditPageData>>;

export default function EditPage({
  data,
}: {
  data: EditPageData;
  pageSlug: string;
}) {
  if (!canAuthEditWiki(data.auth) || !data.page) {
    return (
      <Main>
        <h1>You do not have permission to edit the wiki.</h1>
      </Main>
    );
  }

  return (
    <Main>
      <Editor page={data.page} />
    </Main>
  );
}
