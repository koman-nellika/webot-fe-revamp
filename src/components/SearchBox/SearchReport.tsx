import { Button, Card, Col, Empty, Form, Row, Spin } from "antd";
import clsx from "clsx";
import { memo, useCallback, useEffect, useState } from "react";
import { SearchIcon } from "../Icons";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import Alert from "@/components/Alert";
import DatePicker from "@/components/DatePicker";
import { useQuery } from "react-query";
import Select from "../Select";
import { debounce } from "lodash";
import { DefaultOptionType } from "antd/es/select";
import { CampaignController } from "@/api/controllers/campaign";
import SearchInput from "../SearchInput";

const SearchReport = ({
  onSearch,
  onClear,
  className,
  isReset = false,
  isLoading = false,
}: SearchReportProps & { children?: React.ReactNode }) => {
  const [form] = Form.useForm();
  const startDate = Form.useWatch("startDate", form);
  const endDate = Form.useWatch("endDate", form);

  const [list, setList] = useState<{ campaigns?: any }>({
    campaigns: [],
  });
  const [searchCampaign, setSearchCampaign] = useState("");
  const [meta, setMeta] = useState<IMeta>({
    currentPage: 1,
    totalPages: 4,
  });
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 100,
    search: "",
  });

  const { isFetching: isFetchingCampaignDropDown } = useQuery(
    ["campaign-list-dropdown", { ...queryParams }],
    () =>
      CampaignController().getCampaignList({
        limit: queryParams.limit,
        page: queryParams.page,
        campaignName: queryParams.search,
      }),
    {
      onSuccess: (res: any) => {
        const data = res?.data?.items;
        setMeta(res?.data?.meta);
        const items = data.map((item: any) => {
          return {
            label: item.campaignID,
            value: item.campaignID,
          };
        });
        setList({ campaigns: [] });
        setList((prevState) => ({
          ...prevState,
          campaigns: [...prevState.campaigns, ...items],
        }));
      },
    }
  );

  const handleChange = async (value: string) => {
    setQueryParams({
      page: 1,
      limit: queryParams.limit,
      search: "",
    });
  };
  const onScroll = (event: any) => {
    let target = event.target;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      const page = meta?.currentPage;
      const totalPage = meta?.totalPages;
      const limit = queryParams.limit;
      if (page < totalPage) {
        setQueryParams({
          page: page + 1,
          limit: limit,
          search: searchCampaign,
        });
      }
    }
  };

  const onSearchCampaign = useCallback(
    debounce((value) => {
      setList({ campaigns: [] });
      setSearchCampaign(value);
      setQueryParams({ page: 1, limit: queryParams.limit, search: value });
    }, 500),
    []
  );

  // Filter `option.label` match the user type `input`
  const filterOption: (
    input: string,
    option: DefaultOptionType | undefined
  ) => boolean = (input, option) => {
    const label = typeof option?.label === "string" ? option.label : ""; // ตรวจสอบว่าค่าเป็น string หรือไม่
    return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const onClearSearch = (field: string) => {
    form.resetFields([field]);
    // onClear?.();
  };

  useEffect(() => {
    form.resetFields();
  }, [isReset, form]);

  const disabledFromDate = (current: any) => {
    if (!endDate) return false;
    return dayjs(current).isAfter(endDate);
  };

  const disabledToDate = (current: any) => {
    if (!startDate) return false;
    return dayjs(current).isBefore(dayjs(startDate).startOf("day").valueOf());
  };

  const onFinish = ({ qCampaign, startDate, endDate }: ISearchReport) => {
    const dateFrom = startDate
      ? dayjs(startDate).format("YYYYMMDD")
      : undefined;
    const dateTo = endDate ? dayjs(endDate).format("YYYYMMDD") : undefined;

    if (startDate && endDate) {
      if (startDate > endDate) {
        return Alert.warning({
          message: "The Start date must be earlier than the End date.",
        });
      }

      if (endDate < startDate) {
        return Alert.warning({
          message: "The End date must be greater than the Start date",
        });
      }
    }
    return (
      typeof onSearch === "function" &&
      onSearch({
        qCampaign: qCampaign,
        startDate: dateFrom,
        endDate: dateTo,
      })
    );
  };

  return (
    <Card className={clsx(styles.searchBox, { [`${className}`]: className })}>
      <Form
        form={form}
        colon={false}
        layout="vertical"
        labelAlign="left"
        name="form-search-report"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={[12, 12]} className="full-width" align={"middle"}>
          {/* <Col span={20}>
            <Form.Item name="campaignID">
              <Select
                size="middle"
                showSearch
                allowClear={true}
                maxLengthSearch={100}
                onClearSearch={() => onClearSearch("campaignID")}
                onPopupScroll={onScroll}
                onChange={handleChange}
                onSearch={onSearchCampaign}
                placeholder="Select / Search campaignID"
                filterOption={filterOption}
                optionFilterProp="children"
                options={list.campaigns}
                notFoundContent={
                  isFetchingCampaignDropDown ? (
                    <Spin />
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )
                }
              />
            </Form.Item>
          </Col> */}
          <Col span={20}>
            <Form.Item name="qCampaign">
              <SearchInput
                placeholder="Search With CampaignID and CampaignName"
                maxLength={100}
                onClearSearch={() => onClearSearch("qCampaign")}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="startDate"
              initialValue={dayjs().subtract(1, "day").startOf("day")}
            >
              <DatePicker
                className="full-width"
                size="large"
                placeholder="Date From e.g. 20-11-2023"
                format={"DD-MM-YYYY"}
                disabledDate={disabledFromDate}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item
              name="endDate"
              initialValue={dayjs().subtract(1, "day").startOf("day")}
            >
              <DatePicker
                className="full-width"
                size="large"
                placeholder="Date To e.g. 20-11-2023"
                format={"DD-MM-YYYY"}
                disabledDate={disabledToDate}
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

export interface ISearchReport {
  campaignID?: string | null;
  qCampaign?: string;
  startDate?: any;
  endDate?: any;
}
interface IMeta {
  currentPage: number;
  totalPages: number;
}

export type SearchReportProps = {
  className?: string;
  onSearch?: (value: any) => void;
  onClear?: () => void;
  isLoading?: boolean;
  isReset?: boolean;
};

export default memo(SearchReport);
