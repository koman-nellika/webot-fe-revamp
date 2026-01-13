import { EditIcon, DeleteIcon } from "@/components/Icons";
import { ColumnsType } from "antd/lib/table";

export const TableAction = ({
  onEdit,
  onDelete,
}: TableActionProps): ColumnsType<any> => {
  const columns = [] as ColumnsType;
  if (typeof onEdit === "function") {
    columns.push({
      title: "",
      dataIndex: "",
      key: "",
      width: 80,
      align: "center",
      className: "table-action",
      colSpan: 0,
      fixed: "right",
      render: (_: string, record: any) =>
        typeof onEdit === "function" && (
          <EditIcon
            className="cursor-pointer"
            onClick={() => onEdit(record._id)}
          />
        ),
    });
  }

  if (typeof onDelete === "function") {
    columns.push({
      title: "",
      dataIndex: "",
      key: "",
      width: 80,
      align: "center",
      colSpan: 0,
      fixed: "right",
      render: (_: string, record: any) =>
        typeof onDelete === "function" && (
          <DeleteIcon
            className="cursor-pointer"
            onClick={() => onDelete([record._id])}
          />
        ),
    });
  }

  return columns;
};

type TableActionProps = {
  onEdit?: (record: string) => void;
  onDelete?: (records: string[] | number[], selectedRows?: any[]) => void;
};
