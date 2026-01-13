import { Col, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { ResetIcon } from "@/components/Icons";
import Typography from "@/components/Typography";
import { isServer } from "@/helpers/functions/addons";
import styles from "./index.module.scss";

const UnauthorizedPage: any = () => {
  const [isTimeout, setIsTimeout] = useState(false);
  const router = useRouter();
  const onClick = () => {
    localStorage.removeItem("session");
    return router.replace(`${process.env.NEXT_PUBLIC_BASE_URL}`);
  };

  useEffect(() => {
    if (isServer) return;
    const timeout = localStorage.getItem("session");
    setIsTimeout(!!timeout);
  }, []);

  return (
    <div className="wrapper-full-h">
      <Row className="text-center" justify="center" align="middle">
        <Col span={24}>
          <Typography.Text size="36" weight={400}>
            Your account cannot access this service.
          </Typography.Text>
        </Col>
        {isTimeout && (
          <Col span={24}>
            <div className={styles.wrapperText} onClick={() => onClick()}>
              <ResetIcon />
              <Typography.Text
                className="text-primary ml-2"
                size="24"
                weight={400}
              >
                Try to login again
              </Typography.Text>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

UnauthorizedPage.layout = null;
export default UnauthorizedPage;
