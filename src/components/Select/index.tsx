import clsx from "clsx";
import { memo, useEffect, useRef } from "react";
import { Select as AntdSelect, SelectProps as AntdSelectProps } from "antd";
import ClearIcon from "/public/icons/icon-close.svg";
import styles from "./index.module.scss";
import { DownOutlined } from "@ant-design/icons";
import type { GetRef } from "antd";
type SelectRefType = GetRef<typeof AntdSelect>; // BaseSelectRef

const Select = ({
  className,
  allowClear,
  value,
  onClearSearch,
  maxLengthSearch,
  ...props
}: SelectProps) => {
  // console.log("onClearSearchs", onClearSearch);
  const selectRef = useRef<SelectRefType>(null); // ✅ ใช้ BaseSelectRef
  useEffect(() => {
    if (maxLengthSearch && selectRef.current) {
      // ✅ ดึง <input> ที่ใช้พิมพ์ search
      const inputNode = selectRef.current.nativeElement.querySelector("input");
      if (inputNode) {
        // ✅ ตั้งค่า maxLength ให้ตรงกับค่าที่ส่งมา
        inputNode.setAttribute("maxlength", maxLengthSearch.toString());
      }
    }
  }, [maxLengthSearch]); // ควรเพิ่ม maxLengthSearch ใน dependencies array เพื่อให้ useEffect ทำงานเมื่อค่า maxLengthSearch เปลี่ยน

  const suffix =
    allowClear && value?.length ? (
      <div className={styles.searchIcon} onClick={onClearSearch}>
        <ClearIcon />
      </div>
    ) : (
      <DownOutlined />
    );
  return (
    <AntdSelect
      value={value}
      className={clsx(styles.selectInput, { [`${className}`]: className })}
      // allowClear={allowClear && { clearIcon: <ClearIcon /> }}
      suffixIcon={suffix}
      ref={selectRef}
      {...props}
    />
  );
};
type SelectProps = AntdSelectProps & {
  onClearSearch?: () => void;
  maxLengthSearch?: number;
};
export default memo(Select);
