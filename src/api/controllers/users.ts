import api from "@/api/index";
import {
  IBaseDelete,
  /* IBaseResponse, */
  IPageBaseResponse,
} from "../interfaces/base.interface";
import { IPramsUsers, IUsers } from "../interfaces/users.interface";
import { assertValidId } from "@/helpers/functions/addons";

export const UsersController = () => {
  return {
    getUserList: async ({
      skip = 1,
      limit = 10,
      q = "",
      sort,
      order,
    }: IPramsUsers): Promise<IPageBaseResponse> => {
      const params = {
        skip,
        limit,
        q,
        sort,
        order,
      };
      return await api.get(`/v1/users`, { params });
    },
    /*  getRoles: async (): Promise<IBaseResponse> => {
      return await api.get(`/v1/users/roles`);
    }, */
    createUser: async (data: any) => {
      return await api.post(`/v1/users`, data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      });
    },
    getUserById: async (id: string) => {
      assertValidId(id, "users")
      return await api.get(`/v1/users/${encodeURIComponent(id)}`);
    },
    updateUserById: async ({ id, data }: IUsers) => {
      return await api.put(`/v1/users/${id}`, data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      });
    },
    deleteUserById: async ({ ids }: IBaseDelete) => {
      return await api.delete(`/v1/users`, { data: { ids } });
    },
  };
};
