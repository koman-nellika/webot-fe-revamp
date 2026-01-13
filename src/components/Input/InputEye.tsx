import { memo } from "react";
import { Input, InputProps } from "antd";
import clsx from "clsx";

import styles from "./index.module.scss";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const InputEye = ({
  className,
  allowClear,
  value,
  isVisible,
  onMarkX,
  ...props
}: InputEyeProps) => {
  const suffix =
    typeof onMarkX === "function" ? (
      <div
        className={clsx(styles.markCenter, "cursor-pointer")}
        onClick={onMarkX}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onMarkX();
          }
        }}
        role="button" // ช่วยบ่งบอกว่า div ทำหน้าที่เป็นปุ่ม
        tabIndex={0} // ทำให้ div สามารถได้รับโฟกัส
      >
        {isVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
      </div>
    ) : (
      <span />
    );

  return (
    <Input
      value={value}
      className={clsx({ [`${className}`]: className })}
      {...props}
      suffix={suffix}
    />
  );
};

type InputEyeProps = InputProps & {
  value?: string;
  isVisible: boolean;
  onMarkX?: () => void;
};

export default memo(InputEye);
