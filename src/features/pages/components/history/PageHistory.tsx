import { Main } from "../../../../components/layout/main";
import { Button } from "../../../../components/ui/button";
import { canAuthEditWiki } from "../../../auth/auth.shared";
import { formatDate } from "../../../../utils/FormatDate";
import type { getPageHistoryData } from "../../server/pages.server-fns";

type PageHistoryData = Awaited<ReturnType<typeof getPageHistoryData>>;

export function PageHistory({
  data,
  pageSlug,
}: {
  data: PageHistoryData;
  pageSlug: string;
}) {
  if (!canAuthEditWiki(data.auth)) {
    return (
      <Main>
        <h1>You do not have permission to edit the wiki.</h1>
      </Main>
    );
  }

  return (
    <Main>
      <h1>Page history</h1>
      {data.history && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Summary</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[...data.history].reverse().map((entry) => (
              <tr key={entry.id}>
                <td>{formatDate(new Date(entry.timestamp), true)}</td>
                <td>{entry.user}</td>
                <td>{entry.edit_summary}</td>
                <td>
                  <Button size="xs" href={`/${pageSlug}/history/${entry.id}`}>
                    Show Diff
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Main>
  );
}
