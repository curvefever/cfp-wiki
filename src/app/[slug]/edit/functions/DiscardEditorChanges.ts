import { IPage } from "../../../../features/pages/IPage";

export async function discardEditorChanges(page: IPage) {
    return { redirectTo: '/' + page.slug };
}