import { Metadata } from 'next';
import { IPage } from '../../features/pages/IPage';
import { createSupbaseServerClient } from '../../supabase-server';
import { Main } from '../../components/layout/main';
import { Button } from '../../components/ui/button';
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkGfm from 'remark-gfm'
import {unified} from 'unified'
import remarkAdmonitions from '../../features/remark/RemarkAdmonitions';
import '/src/styles/markdown.css'
import MenuButtons from './MenuButtons';
import { Icon } from '../../components/ui/icon';
import HomeLink from './HomeLink';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
	const supabase = await createSupbaseServerClient();
	const postRes = await supabase.from('pages').select().eq('slug', params.slug).single();
	const page: IPage | undefined = postRes.data;
   
	return {
		title: `CF Wiki | ${page?.title || 'Page not found'}`,
		description: page?.description || '',
	}
  }

export default async function Page({ params }: { params: { slug: string } }) {
	const supabase = await createSupbaseServerClient();
	const { data } = await supabase.auth.getSession();
    const isLoggedIn = data.session !== null;

	const pageSlug = params.slug;
	const postRes = await supabase.from('pages').select().eq('slug', pageSlug).single();
	const page: IPage | undefined = postRes.data;

	if (!page) {
		return (<Main session={data.session}>
            <h1>Page not found.</h1>
            {isLoggedIn && <Button href={`/${pageSlug}/edit`}>Create page</Button>}
        </Main>)
	}

	const htmlContent = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkAdmonitions)
		.use(remarkBreaks)
		.use(remarkRehype, {allowDangerousHtml: true})
		.use(rehypeRaw)
		.use(rehypeStringify)
		.process(page.content);

    
    return <Main session={data.session} menuItems={<MenuButtons page={page} />}>
		{pageSlug !== 'home' && <HomeLink className='absolute top-0' />}
		<h1>{page.title}</h1>
		<div dangerouslySetInnerHTML={{ __html: htmlContent.toString() }} className='mb-5'></div>

		{pageSlug !== 'home' && <HomeLink className='absolute bottom-0' />}
		<a href={`/${pageSlug}`}>
			<Icon icon="arrow-left" className='absolute bottom-0 left-[50%] translate-x-[-50%] p-3 h-12 rotate-90' />
		</a>
		{page.next_link && <a href={`/${page.next_link}`} className='absolute px-5 py-3 w-fit bottom-0 right-0 flex items-center'>
			<span className='ml-2'>{page.next_link}</span>
			<Icon icon="arrow-left" className='h-8 rotate-180' />
		</a>}
    </Main>;
}
