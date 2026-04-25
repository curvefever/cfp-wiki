import { createServerFn } from '@tanstack/react-start';
import { Main } from '../../../components/layout/main';
import { IPageHistory } from '../../../features/pages/IPageHistory';
import { Button } from '../../../components/ui/button';
import { formatDate } from '../../../utils/FormatDate';
;

export const getPageHistoryData = createServerFn({ method: 'GET' })
    .inputValidator((data: { slug: string }) => data)
    .handler(async ({ data }) => {
	const { createSupbaseServerClient } = await import('../../../supabase-server');
	const supabase = await createSupbaseServerClient();
	const { data: sessionData } = await supabase.auth.getSession();
	const historyRes = await supabase.from('page_history').select().eq('page', data.slug);
    const history: IPageHistory[] | undefined = historyRes.data ? historyRes.data as IPageHistory[] : undefined;

    return { history, session: sessionData.session };
});

type PageHistoryData = Awaited<ReturnType<typeof getPageHistoryData>>;

export default function PageHistory({ data, pageSlug }: { data: PageHistoryData; pageSlug: string }) {
    const isLoggedIn = data.session !== null;
    if (!isLoggedIn) {
        return <Main session={data.session}>
            <h1>You must be logged in.</h1>
        </Main>;
    }

    return <Main session={data.session}>
        <h1>Page history</h1>
        {data.history && <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>User</th>
                        <th>Summary</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {[...data.history].reverse().map((entry) => <tr key={entry.id}>
                        <td>{formatDate(new Date(entry.timestamp), true)}</td>
                        <td>{entry.user}</td>
                        <td>{entry.edit_summary}</td>
                        <td>
                            <Button size='xs' href={`/${pageSlug}/history/${entry.id}`}>Show Diff</Button>
                        </td>
                    </tr>)}
                </tbody>
            </table>}
    </Main>;
}

async function LegacyPageHistory({ params }: { params: { slug: string } }) {
    const { createSupbaseServerClient } = await import('../../../supabase-server');
	const supabase = await createSupbaseServerClient();
	const { data } = await supabase.auth.getSession();
    const isLoggedIn = data.session !== null;
    if (!isLoggedIn) {
        return <Main session={data.session}>
            <h1>You must be logged in.</h1>
        </Main>;
    }

	const pageSlug = params.slug;
	const historyRes = await supabase.from('page_history').select().eq('page', pageSlug);
    const history: IPageHistory[] | undefined = historyRes.data ? historyRes.data as IPageHistory[] : undefined;
    
    console.log(data.session);
    return <Main session={data.session}>
        <h1>Page history</h1>
        {history && <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>User</th>
                        <th>Summary</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {history.reverse().map((entry) => <tr key={entry.id}>
                        <td>{formatDate(new Date(entry.timestamp), true)}</td>
                        <td>{entry.user}</td>
                        <td>{entry.edit_summary}</td>
                        <td>
                            <Button size='xs' href={`/${pageSlug}/history/${entry.id}`}>Show Diff</Button>
                        </td>
                    </tr>)}
                </tbody>
            </table>}
    </Main>;
}
