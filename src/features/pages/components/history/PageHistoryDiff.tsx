import { Main } from "../../../../components/layout/main";
import { canAuthEditWiki } from "../../../auth/auth.shared";
import { formatDate } from "../../../../utils/FormatDate";
import type { getPageHistoryDiffData } from "../../server/pages.server-fns";
import { DiffViewer } from "./DiffViewer";
import { RestorePageButton } from "./RestorePageButton";

type PageHistoryDiffData = Awaited<ReturnType<typeof getPageHistoryDiffData>>;

export function PageHistoryDiff({ data }: { data: PageHistoryDiffData }) {
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
