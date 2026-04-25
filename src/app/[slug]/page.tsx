import { createServerFn } from "@tanstack/react-start";
import { IPage } from "../../features/pages/IPage";
import { Main } from "../../components/layout/main";
import { Button } from "../../components/ui/button";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import { remark } from "remark";
import remarkAdmonitions from "../../features/remark/RemarkAdmonitions";
import "../../styles/markdown.css";
import MenuButtons from "./MenuButtons";
import { Icon } from "../../components/ui/icon";
import HomeLink from "./HomeLink";
import AuthenticatedOnly from "../../components/AuthenticatedOnly";
import { createSupbasePublicClient } from "../../supabase-public";

const MAX_RENDERED_CONTENT_CACHE_SIZE = 100;
const renderedContentCache = new Map<string, string>();

export const getWikiPageData = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const page = await getPage(data.slug);

    return {
      page,
      htmlContent: page ? await renderContent(page.content) : "",
    };
  });

async function getPage(slug: string): Promise<IPage | null> {
  const supabase = createSupbasePublicClient();
  const postRes = await supabase
    .from("pages")
    .select("slug,title,description,next_link,content")
    .eq("slug", slug)
    .single();
  return postRes.data as IPage | null;
}

async function renderContent(content: string) {
  const cachedHtml = renderedContentCache.get(content);
  if (cachedHtml) {
    return cachedHtml;
  }

  const htmlContent = (
    await remark()
      .use(remarkGfm)
      .use(remarkAdmonitions)
      .use(remarkBreaks)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
      .process(content)
  ).toString();

  if (renderedContentCache.size >= MAX_RENDERED_CONTENT_CACHE_SIZE) {
    const oldestKey = renderedContentCache.keys().next().value;
    if (oldestKey) {
      renderedContentCache.delete(oldestKey);
    }
  }

  renderedContentCache.set(content, htmlContent);
  return htmlContent;
}

type WikiPageData = Awaited<ReturnType<typeof getWikiPageData>>;

export function WikiPage({ data, pageSlug }: { data: WikiPageData; pageSlug: string }) {
  const { page, htmlContent } = data;

  if (!page) {
    return (
      <Main>
        <h1>Page not found.</h1>
        <AuthenticatedOnly>
          <Button href={`/${pageSlug}/edit`}>Create page</Button>
        </AuthenticatedOnly>
      </Main>
    );
  }

  return (
    <Main menuItems={<MenuButtons page={page} />}>
      {pageSlug !== "home" && <HomeLink className="absolute top-0" />}
      <h1>{page.title}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        className="markdown-content mb-5"
      ></div>

      {pageSlug !== "home" && <HomeLink className="absolute bottom-0" />}
      <a href={`/${pageSlug}`}>
        <Icon
          icon="arrow-left"
          className="absolute bottom-0 left-[50%] translate-x-[-50%] p-3 h-12 rotate-90"
        />
      </a>
      {page.next_link && (
        <a
          href={`/${page.next_link}`}
          className="absolute px-5 py-3 w-fit bottom-0 right-0 flex items-center"
        >
          <span className="ml-2">{page.next_link}</span>
          <Icon icon="arrow-left" className="h-8 rotate-180" />
        </a>
      )}
    </Main>
  );
}
