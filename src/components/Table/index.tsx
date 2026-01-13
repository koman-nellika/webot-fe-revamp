import { Table as AntdTable, Pagination, Row } from "antd";
import type {
  PaginationProps as AntdPaginationProps,
  TableProps as AntdTableProps,
} from "antd/lib";
import clsx from "clsx";
import { memo, useCallback } from "react";
import Typography from "../Typography";

import { NUMBER_OF_ROWS } from "@/helpers/constants/utils";
import NextIcon from "/public/icons/icon-next.svg";
import PrevIcon from "/public/icons/icon-prev.svg";
import styles from "./index.module.scss";
import Select from "@/components/Select";

const Table = ({ pagination, ...props }: TableProps) => {
  const handleChangeRows = useCallback(
    (row: number) => {
      pagination.onPaginationLimit && pagination.onPaginationLimit(row);
    },
    [pagination]
  );

  const numberOfRows = NUMBER_OF_ROWS.map((item) => {
    return { label: item, value: item };
  });

  return (
    <>
      <AntdTable
        columns={props.columns || []}
        pagination={false}
        dataSource={props.dataSource}
        {...props}
      />
      <Row className="mt-10 mb-2" align="middle">
        <Pagination
          className={clsx({
            [`${styles.activePagination}`]:
              !props.loading && (!pagination.total || pagination.total <= 0),
          })}
          size="small"
          nextIcon={<NextIcon />}
          prevIcon={<PrevIcon />}
          showSizeChanger={false}
          defaultCurrent={1}
          pageSize={pagination.pageSize || 10}
          {...pagination}
        />
        <Typography.Text size="20" className="mr-2 ml-auto">
          Number of rows
        </Typography.Text>
        <Select
          defaultValue={pagination.pageSize || NUMBER_OF_ROWS[0]}
          onChange={handleChangeRows}
          value={pagination.pageSize}
          options={numberOfRows}
        >
          {/* {NUMBER_OF_ROWS.map((row: number) => {
            return (
              <Select.Option key={row} value={row}>
                {row}
              </Select.Option>
            );
          })} */}
        </Select>
      </Row>
    </>
  );
};

type TableProps = AntdTableProps<any> & {
  pagination: PaginationProps;
};

type PaginationProps = AntdPaginationProps & {
  onPaginationLimit?: (limit: number) => void;
};

export default memo(Table);
