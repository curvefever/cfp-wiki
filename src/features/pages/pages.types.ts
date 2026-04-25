export interface Page {
  slug: string;
  title: string;
  description: string;
  next_link: string;
  content: string;
}

export interface PageHistoryEntry {
  id: number;
  timestamp: string;
  page: string;
  user: string;
  edit_summary: string;
  content_before: string;
  content_after: string;
}

export interface PageDetails {
  title: string;
  description: string;
  next_link: string;
}