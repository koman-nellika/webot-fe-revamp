import { IPagination } from "./base.interface";

export interface IPramsOt extends IPagination {
  q?: string;
  start_date?: string;
  end_date?: string;
  overtime_id?: string;
  employee_id?: string;
  position_id?: string;
  sort?: string;
  order?: string;
}

export interface IPramsOtExport extends IPagination {
  ids?: string[] | number[];
  q?: string;
  start_date?: string;
  end_date?: string;
  overtime_id?: string;
  employee_id?: string;
  position_id?: string;
  sort?: string;
  order?: string;
}

export interface IOt {
  id: string;
  data: any;
}
