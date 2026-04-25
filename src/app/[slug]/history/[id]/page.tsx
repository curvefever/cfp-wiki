import { createServerFn } from "@tanstack/react-start";
import { Main } from "../../../../components/layout/main";
import { IPageHistory } from "../../../../features/pages/IPageHistory";
import DiffViewer from "./DiffViewer";
import { formatDate } from "../../../../utils/FormatDate";
import RestorePageButton from "./RestorePageButton";


export const getPageHistoryDiffData = createServerFn({ method: 'GET' })
    .inputValidator((data: { id: string }) => data)
    .handler(async ({ data }) => {
	const { createSupbaseServerClient } = await import('../../../../supabase-server');
	const supabase = await createSupbaseServerClient();
	const { data: sessionData } = await supabase.auth.getSession();
	const historyRes = await supabase.from('page_history').select().eq('id', data.id).single();
    const history: IPageHistory | undefined = historyRes.data ? historyRes.data as IPageHistory : undefined;

    return { history, session: sessionData.session };
});

type PageHistoryDiffData = Awaited<ReturnType<typeof getPageHistoryDiffData>>;

export default function PageHistoryDiff({ data }: { data: PageHistoryDiffData }) {
	const isLoggedIn = data.session !== null;
    if (!isLoggedIn) {
        return <Main session={data.session}>
            <h1>You must be logged in.</h1>
        </Main>;
    }

    if (!data.history) {
        return null;
    }

    const history = data.history;
    const diffID = String(history.id);
    
    return <Main session={data.session}>
        <h1>Page diff</h1>
        <div>
            <div><b>Edited by: </b>{history.user}</div>
            <div><b>Date: </b>{formatDate(new Date(history.timestamp), true)}</div>
        </div>
        <RestorePageButton diffID={diffID} />
        <DiffViewer oldValue={history.content_before} newValue={history.content_after} />
    </Main>;
}

async function LegacyPageHistoryDiff({ params }: { params: { slug: string, id: string } }) {
    const { createSupbaseServerClient } = await import('../../../../supabase-server');
	const supabase = await createSupbaseServerClient();
	const { data } = await supabase.auth.getSession();
    const isLoggedIn = data.session !== null;
    if (!isLoggedIn) {
        return <Main session={data.session}>
            <h1>You must be logged in.</h1>
        </Main>;
    }

	const diffID = params.id;
	const historyRes = await supabase.from('page_history').select().eq('id', diffID).single();
    const history: IPageHistory | undefined = historyRes.data ? historyRes.data as IPageHistory : undefined;

    if (!history) {
        return null;
    }
    
    return <Main session={data.session}>
        <h1>Page diff</h1>
        <div>
            <div><b>Edited by: </b>{history.user}</div>
            <div><b>Date: </b>{formatDate(new Date(history.timestamp), true)}</div>
        </div>
        <RestorePageButton diffID={diffID} />
        <DiffViewer oldValue={history.content_before} newValue={history.content_after} />
    </Main>;
}
