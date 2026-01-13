import Typography from "@/components/Typography";
import { PATH_AVATAR } from "@/helpers/constants/utils";
import { Dayjs } from "@/libs/dayjs";
import { useAuth } from "@/libs/hooks/useAuth";
import { Avatar, Col, Layout, Row } from "antd";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import { HamburgerIcon } from "@/components/Icons";
import { useSession } from "next-auth/react";
import { signOut as nextAuthSignOut } from "next-auth/react";
const Header = ({ onCollapsed, collapsed }: HeaderProps) => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  // const { user } = useAuth();

  const onLogout = async () => {
    // return router.push(`/api/login`);
    // return router.push(`/api/logout?t=${new Date().valueOf()}`);
    // localStorage.removeItem("session");
    // return router.replace(`/api/logout?t=${new Date().valueOf()}`);
    await nextAuthSignOut({ callbackUrl: "/", redirect: false });
    router.push("/auth/login");
  };

  return (
    <Layout.Header className={styles.header}>
      <Row align="middle">
        <Col className="mr-auto">
          <HamburgerIcon
            className={styles.menuIcon}
            onClick={() => onCollapsed()}
          />
        </Col>
        <Col xxl={{ span: 5 }}>
          <Row className={styles.wrapperAvatar} justify="end" align="middle">
            <Col>
              <Avatar
                className="avatar"
                size={60}
                // src={
                //   user?.avatar
                //     ? `${PATH_AVATAR}/${user._id}?t=${Dayjs().valueOf()}`
                //     : null
                // }
              >
                {user?.fullname?.charAt(0)?.toUpperCase() ?? ""}
              </Avatar>
            </Col>
            <div className={styles.wrapperProfile}>
              <Typography.Text
                size="18"
                weight={500}
              >{`${user?.fullname}`}</Typography.Text>

              <Typography.Text
                className="text-grey-300"
                size="14"
                weight={400}
              >{`${user?.role ?? "-"}`}</Typography.Text>
            </div>
          </Row>
        </Col>
        <div className="ml-3">
          <Typography.Text
            className={styles.logout}
            weight={500}
            onClick={() => onLogout()}
          >
            Logout
          </Typography.Text>
        </div>
      </Row>
    </Layout.Header>
  );
};

type HeaderProps = {
  onCollapsed: () => void;
  collapsed: boolean;
};

export default Header;
