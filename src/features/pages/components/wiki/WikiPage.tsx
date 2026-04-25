import AuthenticatedOnly from "../../../../components/AuthenticatedOnly";
import { Main } from "../../../../components/layout/main";
import { Button } from "../../../../components/ui/button";
import { Icon } from "../../../../components/ui/icon";
import type { getWikiPageData } from "../../server/pages.server-fns";
import { HomeLink } from "./HomeLink";
import { WikiMenuButtons } from "./WikiMenuButtons";

type WikiPageData = Awaited<ReturnType<typeof getWikiPageData>>;

export function WikiPage({
  data,
  pageSlug,
}: {
  data: WikiPageData;
  pageSlug: string;
}) {
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
    <Main menuItems={<WikiMenuButtons page={page} />}>
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
