import { revalidatePath, revalidateTag } from 'next/cache';

export function revalidateWikiPages(paths: string[] = []) {
  revalidateTag('pages');

  const uniquePaths = new Set<string>(['/', '/home']);
  for (const path of paths) {
    if (!path) {
      continue;
    }

    uniquePaths.add(path.startsWith('/') ? path : `/${path}`);
  }

  uniquePaths.forEach((path) => {
    revalidatePath(path);
  });
}