import { memo } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { check66 } from "@/helpers/functions/addons";

const TableMarkX = ({
  values,
  type,
  index,
  openIndex,
  openType,
  onMarkX,
}: TableMarkXProps) => {
  return (
    <div className={`cursor-pointer`} onClick={onMarkX}>
      {openIndex === index && openType === type
        ? check66(values)
        : check66(values, "X")}
      &nbsp;
      {openIndex === index && openType === type ? (
        <EyeOutlined style={{ fontSize: "16px" }} />
      ) : (
        <EyeInvisibleOutlined style={{ fontSize: "16px" }} />
      )}
    </div>
  );
};

type TableMarkXProps = {
  values: string;
  type: string;
  index: number | string;
  openType: string;
  openIndex: number | string;
  onMarkX?: () => void;
};

export default memo(TableMarkX);
