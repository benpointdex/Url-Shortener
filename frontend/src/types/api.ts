export interface UrlMapping {
  id: number;
  username: string;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  createdDate: string;
}

export interface ClickEvent {
  clickDate: string;
  count: number;
}

export interface User {
  username: string;
  token?: string;
}
