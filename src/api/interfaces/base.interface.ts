/* export interface IBaseResponse {
  statusCode: string;
  message: string;
  data: any;
} */

export interface IMeta {
  total_items?: number;
  item_count: number;
  items_per_page: number;
  total_pages: number;
  current_page: number;
}

export interface IPageBaseResponse {
  status_code: string;
  code: string;
  message: string;
  result: {
    items: any[];
    meta: IMeta;
  };
}

export interface IPagination {
  skip?: number;
  limit?: number;
}

export interface IBaseDelete {
  ids: string[] | number[];
}
