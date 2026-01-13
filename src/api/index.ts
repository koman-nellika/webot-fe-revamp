import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import Router from "next/router";

import Alert from "@/components/Alert";
import { RESPONSE_MESSAGE } from "@/helpers/constants/responseMessage";
import { getSession } from "next-auth/react";

const setToken = async (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PREFIX + `/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});



api.interceptors.request.use(
  (request: any) => {
    return request;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const url = error.config?.url || "";
    if (!["/v1/auth/me"].includes(url) && error.response?.status === 401) {
      // return Router.replace(`/unauthorized`).then(() => {
      //   const err: any = error?.response?.data;
      //   let message = RESPONSE_MESSAGE.UNAUTHORIZED;
      //   if (err.code === "SESSION_TIMEOUT") {
      //     message = err.message;
      //     localStorage.setItem("session", `${new Date().valueOf()}`);
      //   }
      //   return Alert.error({ message });
      // });
    }
    return Promise.reject(error);

    // if (error?.response?.data?.code === "SESSION_TIMEOUT") {
    //   window.location.href = `${process.env.NEXT_PUBLIC_PREFIX}/unauthorized`;
    // } else {
    //   if (error?.response?.status === 401) {
    //     window.location.href = `${process.env.NEXT_PUBLIC_PREFIX}/api/login`;
    //   }
    // }
    // return Promise.reject(error);
  }
);

export { api, setToken };
