import { memo } from "react";
import { Input as AntdInput, InputProps } from "antd";
import clsx from "clsx";

import ClearIcon from "/public/icons/icon-close.svg";
import styles from "./index.module.scss";

const BaseInput = ({ className, allowClear, value, ...props }: InputProps) => {
  return (
    <AntdInput
      value={value}
      className={clsx(styles.inputBox, className)}
      allowClear={allowClear && { clearIcon: <ClearIcon /> }}
      {...props}
    />
  );
};

/**
 * แนบ static properties เหมือน antd Input
 */
const MemoInput = memo(BaseInput);

/**
 * ✅ แนบ static properties อย่างปลอดภัย
 */
const Input = Object.assign(MemoInput, {
  // Group: AntdInput.Group,
  Search: AntdInput.Search,
  TextArea: AntdInput.TextArea,
  Password: AntdInput.Password,
  // OTP: (AntdInput as any).OTP, // กันพลาดถ้าเวอร์ชันยังไม่มี
});

export default Input;
