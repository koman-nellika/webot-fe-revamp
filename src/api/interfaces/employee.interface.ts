import { IPagination } from "./base.interface";

export interface IPramsEmployees extends IPagination {
  search?: string;
  sort?: string;
  order?: string;
}

export interface IEmployees {
  id: string;
  data: any;
}
