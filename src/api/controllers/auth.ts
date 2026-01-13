import { api } from "@/api/index";

export const AuthController = () => {
  return {
    getProfile: async (): Promise<any> => {
      return await api.get(`/v1/auth/me`);
    },
    getDashboard: async (): Promise<any> => {
      return await api.get(`/v1/dashboard/stats`);
    },
  };
};
