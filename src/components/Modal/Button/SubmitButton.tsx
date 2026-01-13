import { Button, Form, FormInstance, Space } from "antd";
import React, { memo, useEffect, useState } from "react";

const SubmitButton = ({ form, destroyAll }: SummitButtonProps) => {
  const [submittable, setSubmittable] = useState(false);

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      },
    );
  }, [form, values]);

  return (
    <Space>
      <Button htmlType="reset" onClick={destroyAll}>
        Cancel
      </Button>
      <Button type="primary" htmlType="submit" disabled={!submittable}>
        Save
      </Button>
    </Space>
  );
};

type SummitButtonProps = {
  form: FormInstance;
  destroyAll?: () => void;
};

export default memo(SubmitButton);
