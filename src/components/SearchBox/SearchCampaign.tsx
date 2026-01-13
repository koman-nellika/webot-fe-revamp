import { Button, Card, Col, Form, Row } from "antd";
import clsx from "clsx";
import { memo, useEffect } from "react";
import { SearchIcon } from "../Icons";
import SearchInput from "../SearchInput";
import styles from "./index.module.scss";

const SearchCampaign = ({
  onSearch,
  onClear,
  className,
  isReset = false,
  isLoading = false,
}: SearchCampaignProps) => {
  const [form] = Form.useForm();

  const onClearSearch = (field: string) => {
    form.resetFields([field]);
    // onClear?.();
  };

  useEffect(() => {
    form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReset]);

  return (
    <Card className={clsx(styles.searchBox, { [`${className}`]: className })}>
      <Form
        form={form}
        colon={false}
        layout="inline"
        name="form-search-user"
        onFinish={onSearch}
        autoComplete="off"
      >
        <Row gutter={[0, 0]} className="full-width" align={"middle"}>
          <Col span={20}>
            <Form.Item name="campaignName">
              <SearchInput
                placeholder="Search with Campaign ID or Campaign Name"
                maxLength={100}
                onClearSearch={() => onClearSearch("campaignName")}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                icon={<SearchIcon />}
                loading={isLoading}
              >
                Search
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

type SearchCampaignProps = {
  className?: string;
  onSearch?: (value: any) => void;
  onClear?: () => void;
  isLoading?: boolean;
  isReset?: boolean;
};

export default memo(SearchCampaign);
