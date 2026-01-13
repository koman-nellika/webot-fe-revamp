import { useAuth } from "@/libs/hooks/useAuth";
import { Layout as AntdLayout } from "antd";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Layout = ({ layout, children }: LayoutProps) => {
  const { data: session } = useSession();
  const user = session?.user
  // const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    // ตรวจสอบว่าหน้าปัจจุบันเป็น /report/[id]
    const isReportDetail =
      /^\/report\/[^/]+$/.test(router.pathname) &&
      router.pathname !== "/report/report-all-upload";

    if (isReportDetail) {
      setCollapsed(true); // เปิด Sidebar แบบย่อ
    }
  }, [router.pathname]);

  return layout === null ? (
    <>{children}</>
  ) : user === null ? (
    <div className="wrapper-full-h">
      <Loading />
    </div>
  ) : (
    <AntdLayout className={styles.layout}>
      <Sidebar collapsed={collapsed} />
      <AntdLayout className={styles.wrapperLayout}>
        <Header onCollapsed={toggleCollapsed} collapsed={collapsed} />
        <AntdLayout.Content className={styles.contentLayout}>
          {children}
        </AntdLayout.Content>
      </AntdLayout>
    </AntdLayout>
  );
};

type LayoutProps = {
  layout?: string | null;
  children: React.ReactNode;
};

export default Layout;
