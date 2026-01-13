import { IPagination } from "./base.interface";

export interface IPramsUsers extends IPagination {
  q?: string;
  sort?: string;
  order?: string;
}

export interface IUsers {
  id: string;
  data: any;
}
