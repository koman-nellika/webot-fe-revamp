import { memo } from "react";
import { Input } from "antd";
import clsx from "clsx";

import ClearIcon from "/public/icons/icon-close.svg";
import styles from "./index.module.scss";
import { TextAreaProps } from "antd/es/input";

const TextArea = ({
  className,
  allowClear,
  value,
  ...props
}: TextAreaProps) => {
  const { TextArea } = Input;

  return (
    <TextArea
      value={value}
      allowClear={allowClear && { clearIcon: <ClearIcon /> }}
      className={clsx(styles.textAreaInput, { [`${className}`]: className })}
      {...props}
    />
  );
};

export default memo(TextArea);
