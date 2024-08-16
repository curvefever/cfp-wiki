import { createSupbaseServerClient } from '../../../supabase-server';
import { Main } from '../../../components/layout/main';
import { IPageHistory } from '../../../features/pages/IPageHistory';
import { Button } from '../../../components/ui/button';
import { formatDate } from '../../../utils/FormatDate';
;

export default async function PageHistory({ params }: { params: { slug: string } }) {
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
