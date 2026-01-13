import { api } from "@/api/index";
import {
    IBaseDelete,
    /* IBaseResponse, */
    IPageBaseResponse,
} from "../interfaces/base.interface";
import { IPramsOt, IOt, IPramsOtExport } from "../interfaces/ot.interface";
import { assertValidId } from "@/helpers/functions/addons";

export const OtController = () => {
    return {
        getOtList: async ({
            skip = 1,
            limit = 10,
            q = "",
            sort,
            order,
        }: IPramsOt): Promise<IPageBaseResponse> => {
            const params = {
                skip,
                limit,
                q,
                sort,
                order,
            };
            return await api.get(`/v1/employee-overtime/get`, { params });
        },
        /*  getRoles: async (): Promise<IBaseResponse> => {
          return await api.get(`/v1/users/roles`);
        }, */
        createOt: async (data: any) => {
            return await api.post(`/v1/employee-overtime/create`, data
            );
        },
        getOtById: async (id: string) => {
            assertValidId(id, "employee-overtime")
            return await api.get(`/v1/employee-overtime/${encodeURIComponent(id)}`);
        },
        updateOtById: async ({ id, data }: IOt) => {
            return await api.put(`/v1/employee-overtime/update/${id}`, data);
        },
        deleteOtById: async ({ ids }: IBaseDelete) => {
            return await api.delete(`/v1/employee-overtime/delete/${ids}`);
        },
        exportOt: async ({
            ids,
            skip,
            limit,
            q,
            start_date,
            end_date,
            employee_id,
            overtime_id,
            position_id,
            sort,
            order,
        }: IPramsOtExport): Promise<IPageBaseResponse> => {
            const params = {
                skip,
                limit,
                q,
                start_date,
                end_date,
                employee_id,
                overtime_id,
                position_id,
                sort,
                order,
            };
            return await api.get(`/v1/employee-overtime/export-pdf`, { params ,responseType: "blob"});
        },
    };
};
