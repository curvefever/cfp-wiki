import { Main } from "../../../../components/layout/main";
import { canAuthEditWiki } from "../../../auth/auth.shared";
import Editor from "../editor/Editor";
import type { getEditPageData } from "../../server/pages.server-fns";

type EditPageData = Awaited<ReturnType<typeof getEditPageData>>;

export function EditPage({ data }: { data: EditPageData; pageSlug: string }) {
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
