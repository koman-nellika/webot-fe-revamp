import { Layout, Menu } from "antd";
import clsx from "clsx";
import { useRouter } from "next/router";
import { memo, useMemo } from "react";
import styles from "./index.module.scss";

import Images from "@/components/Images";
import Typography from "@/components/Typography";
import { useAuth } from "@/libs/hooks/useAuth";

import {
  HomeOutlined,
  HistoryOutlined,
  ScheduleOutlined,
  ContainerOutlined,
  AuditOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { UserIcon } from "@/components/Icons";

const Sidebar = ({ collapsed }: SidebarProps) => {
  const router = useRouter();
  const { permissions } = useAuth();
  const { isAdmin } = useAuth();
  const MENUS = [
    {
      key: "/home",
      title: "",
      icon: <HomeOutlined />,
      menu: "",
      label: (
        <Typography.Link
          size="24"
          weight={500}
          className={styles.menuLink}
          href={"/"}
        >
          Home
        </Typography.Link>
      ),
    },
    {
      key: "/ot",
      title: "",
      icon: <ScheduleOutlined />,
      menu: "OT",
      label: (
        <Typography.Link
          size="24"
          weight={500}
          className={styles.menuLink}
          href={"/ot"}
        >
          OT
        </Typography.Link>
      ),
    },
    {
      key: "/employee",
      title: "",
      icon: <ContainerOutlined />,
      menu: "EMPLOYEE",
      label: (
        <Typography.Link
          size="24"
          weight={500}
          className={styles.menuLink}
          href={"/employee"}
        >
          Employee
        </Typography.Link>
      ),
    },
    // {
    //   key: "/schedule",
    //   title: "",
    //   hidden: !isAdmin,
    //   menu: "SCHEDULE",
    //   icon: <ScheduleOutlined />,
    //   label: (
    //     <Typography.Link
    //       size="24"
    //       weight={500}
    //       className={styles.menuLink}
    //       href={"/schedule"}
    //     >
    //       Schedule
    //     </Typography.Link>
    //   ),
    // },
    // {
    //   key: "/manage",
    //   title: "",
    //   menu: "MANAGE",
    //   icon: <AuditOutlined />,
    //   label: (
    //     <Typography.Link
    //       size="24"
    //       weight={500}
    //       className={styles.menuLink}
    //       href={"/manage"}
    //     >
    //       Manage
    //     </Typography.Link>
    //   ),
    // },
    // {
    //   key: "/history",
    //   title: "",
    //   menu: "HISTORY",
    //   icon: <HistoryOutlined />,
    //   label: (
    //     <Typography.Link
    //       size="24"
    //       weight={500}
    //       className={styles.menuLink}
    //       href={"/history"}
    //     >
    //       History
    //     </Typography.Link>
    //   ),
    // },
    // {
    //   key: "/report",
    //   title: "",
    //   menu: "REPORT",
    //   icon: <BarChartOutlined />,
    //   label: (
    //     <Typography.Link
    //       size="24"
    //       weight={500}
    //       className={styles.menuLink}
    //       href={"/report"}
    //     >
    //       Report
    //     </Typography.Link>
    //   ),
    // },
    // {
    //   key: "/users",
    //   title: "",
    //   menu: "USER",
    //   icon: <UserIcon />,
    //   label: (
    //     <Typography.Link
    //       size="24"
    //       weight={500}
    //       className={styles.menuLink}
    //       href={"/users"}
    //     >
    //       User
    //     </Typography.Link>
    //   ),
    // },
  ];
  // ].filter((item) => !item.hidden);

  const matchKey = (key: string, path: string): boolean => {
    return new RegExp(`^${key}$`).test(path);
  };

  const currentMenu = useMemo(() => {
    const split = router.asPath.split("/");
    const routePath = split[1];
    const subPath = split[2];
    const path = `/${routePath}`;
    const fullPath = subPath ? `${path}/${subPath}` : path;
    let routeMatched: any = null;
    let children: any = null;

    for (const menu of MENUS) {
      const findMenu = matchKey(menu.key, path) || menu.key === fullPath;
      if (findMenu) {
        routeMatched = menu;
        break;
      }
    }

    if (children) {
      return children?.key ?? `/home`;
    }
    return routeMatched?.key ?? `/home`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  return (
    <Layout.Sider
      theme="light"
      className={styles.sidebar}
      width="300"
      collapsedWidth={88}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      {collapsed ? (
        <div className={styles.logoSmall}>
          <Images
            src="/images/logo-small.svg"
            alt="ais"
            width={67}
            height={67}
          />
        </div>
      ) : (
        <div className={styles.logo}>
          <Images src="/images/logo.svg" alt="ais" width={200} height={80} />
        </div>
      )}
      <Menu
        className={clsx(styles.menu, "mt-5")}
        mode="inline"
        selectedKeys={[currentMenu]}
        items={MENUS}
      />
    </Layout.Sider>
  );
};

type SidebarProps = {
  collapsed: boolean;
};

export default memo(Sidebar);
