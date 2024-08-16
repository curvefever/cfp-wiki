import dateFormat from 'dateformat';

export function formatDate(date: Date, includeTime?: boolean): string {
    if (includeTime) {
        return dateFormat(date, "mmm d, yyyy - HH:MM");
    }
    return dateFormat(date, "mmm d, yyyy");
}