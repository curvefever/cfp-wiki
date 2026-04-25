import { createServerFn } from "@tanstack/react-start";
import { Main } from "../../../../components/layout/main";
import { IPageHistory } from "../../../../features/pages/IPageHistory";
import DiffViewer from "./DiffViewer";
import { formatDate } from "../../../../utils/FormatDate";
import RestorePageButton from "./RestorePageButton";
import { canAuthEditWiki } from "../../../../features/auth/auth.shared";

export const getPageHistoryDiffData = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { getRequestAuthSnapshot } =
      await import("../../../../features/auth/server/request-auth-snapshot.server");
    const auth = await getRequestAuthSnapshot();
    if (!canAuthEditWiki(auth)) {
      return { auth, history: undefined };
    }

    const { createSupbaseServerClient } =
      await import("../../../../supabase-server");
    const supabase = await createSupbaseServerClient();
    const historyRes = await supabase
      .from("page_history")
      .select()
      .eq("id", data.id)
      .single();
    const history: IPageHistory | undefined = historyRes.data
      ? (historyRes.data as IPageHistory)
      : undefined;

    return { auth, history };
  });

type PageHistoryDiffData = Awaited<ReturnType<typeof getPageHistoryDiffData>>;

export default function PageHistoryDiff({
  data,
}: {
  data: PageHistoryDiffData;
}) {
  if (!canAuthEditWiki(data.auth)) {
    return (
      <Main>
        <h1>You do not have permission to edit the wiki.</h1>
      </Main>
    );
  }

  if (!data.history) {
    return null;
  }

  const history = data.history;
  const diffID = String(history.id);

  return (
    <Main>
      <h1>Page diff</h1>
      <div>
        <div>
          <b>Edited by: </b>
          {history.user}
        </div>
        <div>
          <b>Date: </b>
          {formatDate(new Date(history.timestamp), true)}
        </div>
      </div>
      <RestorePageButton diffID={diffID} />
      <DiffViewer
        oldValue={history.content_before}
        newValue={history.content_after}
      />
    </Main>
  );
}
