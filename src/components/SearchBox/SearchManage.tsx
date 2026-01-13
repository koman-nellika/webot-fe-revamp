import { Button, Card, Col, Form, Row } from "antd";
import clsx from "clsx";
import { memo, useEffect, useState } from "react";
import { SearchIcon } from "../Icons";
import SearchInput from "../SearchInput";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import Alert from "@/components/Alert";
import DatePicker from "@/components/DatePicker";
import { useQuery } from "react-query";
import { ScheduleController } from "@/api/controllers/schedule";
import Select from "../Select";
import { DefaultOptionType } from "antd/es/select";

const SearchManage = ({
  onSearch,
  onClear,
  className,
  isReset = false,
  isLoading = false,
}: SearchManageProps & { children?: React.ReactNode }) => {
  const [form] = Form.useForm();
  const startDate = Form.useWatch("startDate", form);
  const endDate = Form.useWatch("endDate", form);

  // const [startTime, setStartTime] = useState<string>("");
  // const [endTime, setEndTime] = useState<string>("");

  // const handleStartTimeChange = (value: any) => {
  //   setStartTime(value);
  //   // ถ้า endTime มีค่า และ startTime มากกว่า endTime → รีเซ็ต endTime
  //   if (endTime && value > endTime) {
  //     setEndTime("");
  //     form.resetFields(["endTime"]);
  //   }
  // };

  // const handleEndTimeChange = (value: any) => {
  //   setEndTime(value);
  //   // ถ้า startTime มีค่า และ startTime มากกว่า endTime → รีเซ็ต startTime
  //   if (startTime && value < startTime) {
  //     setStartTime("");
  //     form.resetFields(["startTime"]);
  //   }
  // };

  const { data: timeOptions } = useQuery({
    queryKey: ["timeData"],
    queryFn: ScheduleController().getTimeData,
    // staleTime: 1000 * 60 * 5, // แคชไว้ 5 นาที
    refetchOnWindowFocus: false, // ไม่ต้องโหลดใหม่เมื่อสลับแท็บ
    // select: (data) => {
    //   return data.map((item: any) => ({
    //     ...item,
    //     label: item.label.slice(0,5),
    //   }));
    // },
  });

  const onClearSearch = (field: string) => {
    form.resetFields([field]);
    // if (field === "startTime") {
    //   setStartTime("");
    // }
    // if (field === "endTime") {
    //   setEndTime("");
    // }
    // onClear?.();
  };

  useEffect(() => {
    form.resetFields();
    // setEndTime("");
    // setStartTime("");
  }, [isReset, form]);

  const disabledFromDate = (current: any) => {
    if (!endDate) return false;
    return dayjs(current).isAfter(endDate);
  };

  const disabledToDate = (current: any) => {
    if (!startDate) return false;
    return dayjs(current).isBefore(dayjs(startDate).startOf("day").valueOf());
  };

  // const timeDisabled = (
  //   timeCheck: string | undefined
  // ): DefaultOptionType[] | undefined => {
  //   return timeOptions?.map((time: { lable: string; value: string }) => ({
  //     ...time,
  //     disabled: timeCheck && time.value > timeCheck, // ปิดการเลือกที่มากกว่า
  //   }));
  // };

  const onFinish = ({
    campaignName,
    createName,
    mobileNo,
    startDate,
    endDate,
    time,
  }: ISearchManage) => {
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
        campaignName: campaignName,
        createName: createName,
        mobileNo: mobileNo,
        startDate: dateFrom,
        endDate: dateTo,
        time: time,
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
        name="form-search-manage"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={[12, 12]} className="full-width" align={"middle"}>
          <Col span={10}>
            <Form.Item name="campaignName">
              <SearchInput
                placeholder="Campaign e.g. Campaign 1"
                maxLength={100}
                onClearSearch={() => onClearSearch("campaignName")}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="mobileNo"
              normalize={(value) => value.replace(/[^0-9]/g, "")}
            >
              <SearchInput
                placeholder="Mobile No e.g. 0899999991"
                maxLength={10}
                onClearSearch={() => onClearSearch("mobileNo")}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="startDate" initialValue={dayjs().startOf("day")}>
              <DatePicker
                className="full-width"
                size="large"
                placeholder="Date From e.g. 20-11-2023"
                format={"DD-MM-YYYY"}
                disabledDate={disabledFromDate}
                allowClear
                style={{}}
              />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item
              name="endDate"
              // initialValue={dayjs()}
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

          <Col span={10}>
            <Form.Item name="createName">
              <SearchInput
                placeholder="User Create e.g. live better"
                maxLength={50}
                onClearSearch={() => onClearSearch("createName")}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item name="time">
              <Select
                mode="multiple"
                size="middle"
                showSearch={false}
                allowClear={true}
                maxTagCount="responsive"
                placeholder="Select Time"
                onClearSearch={() => onClearSearch("time")}
                // value={startTime}
                // onChange={handleStartTimeChange}
                options={timeOptions}
                // options={timeOptions?.map(
                //   (time: { lable: string; value: string }) => ({
                //     ...time,
                //     disabled: endTime && time.value > endTime, // ปิดการเลือกที่มากกว่า endTime
                //   })
                // )}
              />
            </Form.Item>
          </Col>

          {/* <Col span={10}>
            <Form.Item name="startTime">
              <Select
                size="middle"
                showSearch={false}
                allowClear={true}
                placeholder="Select Start Time"
                onClearSearch={() => onClearSearch("startTime")}
                value={startTime}
                onChange={handleStartTimeChange}
                options={timeOptions?.map(
                  (time: { lable: string; value: string }) => ({
                    ...time,
                    disabled: endTime && time.value > endTime, // ปิดการเลือกที่มากกว่า endTime
                  })
                )}
              />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item name="endTime">
              <Select
                size="middle"
                showSearch={false}
                allowClear
                placeholder="Select End Time "
                onClearSearch={() => onClearSearch("endTime")}
                value={endTime}
                onChange={handleEndTimeChange}
                options={timeOptions?.map(
                  (time: { lable: string; value: string }) => ({
                    ...time,
                    disabled: startTime && time.value < startTime, // ปิดการเลือกที่น้อยกว่า startTime
                  })
                )}
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

interface ISearchManage {
  campaignName?: string | null;
  createName?: string | null;
  mobileNo?: string;
  startDate?: any;
  endDate?: any;
  time?: string[];
  startTime?: string;
  endTime?: string;
}

export type SearchManageProps = {
  className?: string;
  onSearch?: (value: any) => void;
  onClear?: () => void;
  isLoading?: boolean;
  isReset?: boolean;
};

export default memo(SearchManage);
