import {api} from "@/api/index";
import {
    IBaseDelete,
    /* IBaseResponse, */
    IPageBaseResponse,
} from "../interfaces/base.interface";
import { IPramsEmployees, IEmployees } from "../interfaces/employee.interface";
import { assertValidId } from "@/helpers/functions/addons";

export const EmployeesController = () => {
    return {
        getEmployeeList: async ({
            skip = 1,
            limit = 10,
            search = "",
            sort,
            order,
        }: IPramsEmployees): Promise<IPageBaseResponse> => {
            const params = {
                skip,
                limit,
                search,
                sort,
                order,
            };
            return await api.get(`/v1/employees/get`, { params });
        },
        /*  getRoles: async (): Promise<IBaseResponse> => {
          return await api.get(`/v1/users/roles`);
        }, */
        createEmployee: async (data: any) => {
            return await api.post(`/v1/employees/create`, data
            );
        },
        getEmployeeById: async (id: string) => {
            assertValidId(id, "employees")
            return await api.get(`/v1/employees/${encodeURIComponent(id)}`);
        },
        updateEmployeeById: async ({ id, data }: IEmployees) => {
            return await api.put(`/v1/employees/update/${id}`, data);
        },
        deleteEmployeeById: async ({ ids }: IBaseDelete) => {
            return await api.delete(`/v1/employees/delete/${ids}`);
        },
    };
};
