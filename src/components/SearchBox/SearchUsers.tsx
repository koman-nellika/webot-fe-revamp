import { Button, Card, Col, Form, Row } from "antd";
import clsx from "clsx";
import { memo, useEffect } from "react";
import { SearchIcon } from "../Icons";
import SearchInput from "../SearchInput";
import styles from "./index.module.scss";

const SearchUser = ({
  onSearch,
  onClear,
  className,
  isReset = false,
  isLoading = false,
}: SearchUserProps) => {
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
            <Form.Item name="q">
              <SearchInput
                placeholder="Search with Firstname, Lastname, Mobile No, Username and Email"
                maxLength={100}
                onClearSearch={() => onClearSearch("q")}
                allowClear
              />
            </Form.Item>
          </Col>

          {/*   
         <Col span={12}>
         <Form.Item name="firstName" style={{ minWidth: "50%" }}>
          <SearchInput
            placeholder="Firstname"
            maxLength={100}
            onClearSearch={() => onClearSearch("q")}
            allowClear
          />
        </Form.Item> 
        </Col>
        <Col span={12}>
        <Form.Item name="lastName" style={{ minWidth: "50%" }}>
          <SearchInput
            placeholder="Lastname"
            maxLength={100}
            onClearSearch={() => onClearSearch("q")}
            allowClear
          />
        </Form.Item> 
        </Col>
        <Col span={12}>
        <Form.Item name="mobileNumber" style={{ minWidth: "50%" }}>
          <SearchInput
            placeholder="Mobile No"
            maxLength={100}
            onClearSearch={() => onClearSearch("q")}
            allowClear
          />
        </Form.Item> 
        </Col>
        <Col span={12}>
        <Form.Item name="username" style={{ minWidth: "50%" }}>
          <SearchInput
            placeholder="Username"
            maxLength={100}
            onClearSearch={() => onClearSearch("q")}
            allowClear
          />
        </Form.Item> 
        </Col><Col span={12}>
        <Form.Item name="email" style={{ minWidth: "50%" }}>
          <SearchInput
            placeholder="Email"
            maxLength={100}
            onClearSearch={() => onClearSearch("q")}
            allowClear
          />
        </Form.Item> 
        </Col> */}
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

type SearchUserProps = {
  className?: string;
  onSearch?: (value: any) => void;
  onClear?: () => void;
  isLoading?: boolean;
  isReset?: boolean;
};

export default memo(SearchUser);
