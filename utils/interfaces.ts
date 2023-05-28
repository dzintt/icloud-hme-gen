export interface Cookie {
  domain?: string;
  expirationDate?: number;
  hostOnly?: boolean;
  httpOnly?: boolean;
  name: string;
  path?: string;
  sameSite?: string;
  secure?: boolean;
  session?: boolean;
  storeId?: string;
  value: string;
  id?: number;
}

export interface EmailInfo {
  origin: string;
  anonymousId: string;
  domain: string;
  forwardToEmail: string;
  hme: string;
  label: string;
  note: string;
  createTimestamp: number;
  isActive: boolean;
  recipientMailId: string;
}
