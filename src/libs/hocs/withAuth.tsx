import { useAuth } from "../hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

interface IWithAuth extends React.FC {
  menu?: string;
}

const withAuth: CallableFunction = (AuthComponent: IWithAuth) => {
  const AuthenHOC: any = ({ ...props }) => {
    const router = useRouter();
    const { user, permissions, isAdmin } = useAuth();

    const hasPermission = useMemo(() => {
      if (!AuthComponent?.menu) return true;
      // return permissions.includes(AuthComponent?.menu);
      if (AuthComponent?.menu === "SCHEDULE" && !isAdmin) {
        return false; // User is not an admin, no permission
      }
      return true; // Admins have full access
    }, [isAdmin]);

    useEffect(() => {
      if (!hasPermission) {
        router.replace(`/`);
      }
    }, [hasPermission, router]);

    return user === null ? (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loading />
      </div>
    ) : user?._id && hasPermission ? (
      <AuthComponent {...props} />
    ) : (
      <div />
    );
  };

  return AuthenHOC;
};

export default withAuth;
