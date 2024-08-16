import { createSupbaseServerClient } from '../../../supabase-server';
import { IPage } from '../../../features/pages/IPage';
import { Main } from '../../../components/layout/main';
import Editor from '../../../components/editor/Editor';

export default async function EditPage({ params }: { params: { slug: string } }) {
	const supabase = await createSupbaseServerClient();
	const { data } = await supabase.auth.getSession();
    const isLoggedIn = data.session !== null;
    if (!isLoggedIn) {
        return <Main session={data.session}>
            <h1>You must be logged in.</h1>
        </Main>;
    }

	const pageSlug = params.slug;
	const postRes = await supabase.from('pages').select().eq('slug', pageSlug).single();
	let page: IPage | undefined = postRes.data;
    if (!page) {
        page = { slug: pageSlug, title: pageSlug, description: pageSlug, content: '' };
    }
    
    return <Main session={data.session}>
        <Editor page={page} user={data.session.user} />
    </Main>;
}
