import { Spin } from "antd";
import { memo } from "react";

const Loading = ({ children, spinning = true }: LoadingProps) => {
  return (
    <Spin tip="Loading..." size="large" spinning={spinning}>
      {children || <div style={{ width: "42px" }} />}
    </Spin>
  );
};

type LoadingProps = {
  spinning?: boolean;
  children?: React.ReactNode;
};

export default memo(Loading);
