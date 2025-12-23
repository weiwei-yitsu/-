
export interface AttractionImage {
  src: string;
  subject: string;
  ext: string;
}

export interface Attraction {
  id: number;
  name: string;
  name_zh: string | null;
  open_status: number;
  introduction: string;
  open_time: string;
  zipcode: string;
  distric: string;
  address: string;
  tel: string;
  fax: string;
  email: string;
  months: string;
  nlat: number;
  elong: number;
  official_site: string;
  facebook: string;
  ticket: string;
  remind: string;
  staytime: string;
  modified: string;
  url: string;
  category: { id: number; name: string }[];
  target: { id: number; name: string }[];
  service: { id: number; name: string }[];
  friendly: { id: number; name: string }[];
  images: AttractionImage[];
  links: any[];
}

export interface ApiResponse {
  total: number;
  data: Attraction[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  EMPTY = 'EMPTY',
  ERROR = 'ERROR'
}
