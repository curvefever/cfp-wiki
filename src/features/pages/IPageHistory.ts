export interface IPageHistory {
    id: number;
    timestamp: string;
    page: string;
    user: string;
    edit_summary: string;
    content_before: string;
    content_after: string;
}