import { createServerFn } from '@tanstack/react-start';
import { IPage } from '../../../features/pages/IPage';
import { Main } from '../../../components/layout/main';
import Editor from '../../../components/editor/Editor';

export const getEditPageData = createServerFn({ method: 'GET' })
    .inputValidator((data: { slug: string }) => data)
    .handler(async ({ data }) => {
	const { createSupbaseServerClient } = await import('../../../supabase-server');
	const supabase = await createSupbaseServerClient();
	const { data: sessionData } = await supabase.auth.getSession();
    const pageSlug = data.slug;
	const postRes = await supabase.from('pages').select().eq('slug', pageSlug).single();
    const page: IPage = postRes.data || { slug: pageSlug, title: pageSlug, description: pageSlug, next_link: '', content: '' };

    return { page, session: sessionData.session };
});

type EditPageData = Awaited<ReturnType<typeof getEditPageData>>;

export default function EditPage({ data }: { data: EditPageData; pageSlug: string }) {
    const session = data.session;
    if (!session) {
        return <Main session={data.session}>
            <h1>You must be logged in.</h1>
        </Main>;
    }
    
    return <Main session={session}>
        <Editor page={data.page} user={session.user} />
    </Main>;
}

async function LegacyEditPage({ params }: { params: { slug: string } }) {
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
	const postRes = await supabase.from('pages').select().eq('slug', pageSlug).single();
	let page: IPage | undefined = postRes.data;
    if (!page) {
        page = { slug: pageSlug, title: pageSlug, description: pageSlug, next_link: '', content: '' };
    }
    
    return <Main session={data.session}>
        <Editor page={page} user={data.session.user} />
    </Main>;
}
