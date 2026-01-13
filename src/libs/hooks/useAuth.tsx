import { AuthController } from "@/api/controllers/auth";
import Alert from "@/components/Alert";
import { RESPONSE_MESSAGE } from "@/helpers/constants/responseMessage";
import Router, { useRouter } from "next/router";
import { createContext, useContext, useState } from "react";
import { useQuery } from "react-query";
import { isServer } from "@/helpers/functions/addons";
import { lowerCase } from "lodash";
import { decryptData } from "@/helpers/constants/utils";
const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: any) => {
  const auth: any = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): IAuth => {
  return useContext(AuthContext);
};

interface IDataProfile {
  _id: string;
  username: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  mobileNumber?: string | null;
  email?: string | null;
  avatar?: string | null;
  // role: { _id: number; code: string; name: string; permissions: string[] };
  role: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

interface IProfile {
  profile: IDataProfile | null;
}

interface IAuth {
  user: IDataProfile | null;
  permissions: string[];
  isAdmin: boolean;
  refetch: () => void;
}

export enum ROLE {
  ADMIN = "Admin",
  VIEWER = "Viewer",
}

function useProvideAuth() {
  const [user, setUser] = useState<IProfile>({ profile: null });
  const router = useRouter();

  // const { refetch: getProfile } = useQuery(
  //   "get-profile",
  //   () => AuthController().getProfile(),
  //   {
  //     enabled:
  //       !isServer && !["/unauthorized", "/version"].includes(router.pathname),
  //     retry: false,
  //     onSuccess: ({ data }) => {
  //       const res = decryptData(data);
  //       setUser({ profile: JSON.parse(res) });
  //     },
  //     onError: (error: any) => {
  //       Router.replace(`/unauthorized`).then(() => {
  //         let message = RESPONSE_MESSAGE.UNAUTHORIZED;
  //         if (error?.response?.data?.code === "SESSION_TIMEOUT") {
  //           localStorage.setItem("session", `${new Date().valueOf()}`);
  //           message = error?.response?.data?.message;
  //         }
  //         return Alert.error({ message });
  //       });
  //     },
  //   }
  // );

  return {
    // user: user.profile,
    // // permissions: user.profile?.role?.permissions || [],
    isAdmin: true,
    // refetch: getProfile,
  };
}
