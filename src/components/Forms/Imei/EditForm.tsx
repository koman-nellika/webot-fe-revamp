import { Form, FormItemProps } from "antd";
import clsx from "clsx";
import styles from "./index.module.scss";
import { memo } from "react";

const EditForm = ({
  dataIndex,
  inputNode,
  className,
  ...props
}: EditFormProps) => {
  return (
    <Form.Item
      className={clsx(styles.formInput, {
        [`${className}`]: className,
      })}
      name={dataIndex}
      {...props}
    >
      {inputNode}
    </Form.Item>
  );
};

type EditFormProps = FormItemProps & {
  dataIndex: string;
  inputNode: any;
};
export default memo(EditForm);
