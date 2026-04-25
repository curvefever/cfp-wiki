import { remark } from "remark";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkAdmonitions from "../../remark/RemarkAdmonitions";

const MAX_RENDERED_CONTENT_CACHE_SIZE = 100;
const renderedContentCache = new Map<string, string>();

export async function renderMarkdownContent(content: string) {
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