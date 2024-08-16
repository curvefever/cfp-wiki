'use server';
import { redirect } from "next/navigation";
import { IPage } from "../../../../features/pages/IPage";

export async function discardEditorChanges(page: IPage) {
    redirect('/' + page.slug);
}