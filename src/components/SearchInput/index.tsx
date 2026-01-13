import { memo } from "react";
import { Input, InputProps } from "antd";
import clsx from "clsx";

import ClearIcon from "/public/icons/icon-close.svg";
import styles from "./index.module.scss";

const SearchInput = ({
  className,
  allowClear,
  value,
  onClearSearch,
  ...props
}: SearchInputProps) => {
  const suffix =
    allowClear && value?.length ? (
      <div className={styles.searchIcon} onClick={onClearSearch}>
        <ClearIcon />
      </div>
    ) : (
      <span />
    );
  return (
    <Input
      value={value}
      className={clsx(styles.searchInput, { [`${className}`]: className })}
      {...props}
      suffix={suffix}
    />
  );
};

type SearchInputProps = InputProps & {
  value?: string;
  onClearSearch?: () => void;
};

export default memo(SearchInput);
