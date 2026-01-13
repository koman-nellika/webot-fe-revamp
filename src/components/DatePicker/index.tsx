import clsx from "clsx";
import { memo } from "react";
import { DatePicker as AntdDatePicker } from "antd";
import { PickerProps } from "antd/lib/date-picker/generatePicker";
import ClearIcon from "/public/icons/icon-close.svg";
import DateIcon from "/public/icons/icon-date.svg";
import styles from "./index.module.scss";

const DatePicker = ({
  className,
  allowClear,
  value,
  ...props
}: PickerProps<any>) => {
  return (
    <AntdDatePicker
      className={clsx(styles.datePickerInput, { [`${className}`]: className })}
      value={value}
      allowClear={allowClear && { clearIcon: <ClearIcon /> }}
      suffixIcon={
        allowClear && value && Object.keys(value) ? <span /> : <DateIcon />
      }
      {...props}
    />
  );
};

export default memo(DatePicker);
