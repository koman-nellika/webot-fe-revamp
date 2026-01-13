import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { setToken } from "@/api";

interface AuthProviderProps {
  children: ReactNode;
}

const LOGIN_PATH = "/auth/login";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const pathname = router.pathname;

  const accessToken = session?.access_token;

  // console.log('session auth', session)
  // console.log('accesstoken', accessToken)

  // // ✅ Hooks ต้องอยู่บนสุด และถูกเรียกทุก render
  // useEffect(() => {
  //   if (!accessToken) return;
  //   setToken(accessToken);
  // }, [accessToken]);

  // ⏳ ระหว่างเช็ค session
  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ❌ ยังไม่ login
  if (status === "unauthenticated" || !accessToken) {
    if (pathname !== LOGIN_PATH) {
      router.replace(LOGIN_PATH);
      return null;
    }
    return <>{children}</>;
  }

  // ✅ login แล้ว แต่พยายามเข้า login
  if (pathname === LOGIN_PATH) {
    router.replace("/");
    return null;
  }

  return <>{children}</>;
};
