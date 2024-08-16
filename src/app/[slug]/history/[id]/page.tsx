import { redirect } from "next/navigation";
import { Main } from "../../../../components/layout/main";
import { IPageHistory } from "../../../../features/pages/IPageHistory";
import { createSupbaseServerClient } from "../../../../supabase-server";
import DiffViewer from "./DiffViewer";
import { formatDate } from "../../../../utils/FormatDate";
import RestorePageButton from "./RestorePageButton";


export default async function PageHistoryDiff({ params }: { params: { slug: string, id: string } }) {
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
        return redirect(`/${params.slug}/history`);
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
