import { createServerFn } from "@tanstack/react-start";
import { Main } from "../../../components/layout/main";
import { IPageHistory } from "../../../features/pages/IPageHistory";
import { Button } from "../../../components/ui/button";
import { formatDate } from "../../../utils/FormatDate";
import { canAuthEditWiki } from "../../../features/auth/auth.shared";
export const getPageHistoryData = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { getRequestAuthSnapshot } =
      await import("../../../features/auth/server/request-auth-snapshot.server");
    const auth = await getRequestAuthSnapshot();
    if (!canAuthEditWiki(auth)) {
      return { auth, history: undefined };
    }

    const { createSupbaseServerClient } =
      await import("../../../supabase-server");
    const supabase = await createSupbaseServerClient();
    const historyRes = await supabase
      .from("page_history")
      .select()
      .eq("page", data.slug);
    const history: IPageHistory[] | undefined = historyRes.data
      ? (historyRes.data as IPageHistory[])
      : undefined;

    return { auth, history };
  });

type PageHistoryData = Awaited<ReturnType<typeof getPageHistoryData>>;

export default function PageHistory({
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
