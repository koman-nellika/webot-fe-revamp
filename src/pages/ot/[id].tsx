import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Space,
  Spin,
  Upload,
  DatePicker as AntDatePicker,
} from "antd";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";

import Alert from "@/components/Alert";
import Confirm from "@/components/Confirm";
import {
  CheckIcon,
  DeleteIcon,
  UploadIcon,
  ResetIcon,
  CloseIcon,
} from "@/components/Icons";
import Loading from "@/components/Loading";
import Typography from "@/components/Typography";
import { RESPONSE_MESSAGE } from "@/helpers/constants/responseMessage";
import { PATH_AVATAR } from "@/helpers/constants/utils";
import { mapMessageError } from "@/helpers/functions/mapMessageError";
import { Dayjs } from "@/libs/dayjs";
import { useAuth, ROLE } from "@/libs/hooks/useAuth";
import { UserOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import Compressor from "compressorjs";
import Select from "@/components/Select";
import { debounce, lowerCase } from "lodash";
import { EmployeesController } from "@/api/controllers/employee";
import { DefaultOptionType } from "antd/es/select";
import dayjs from "dayjs";
import DatePicker from "@/components/DatePicker";
import TextArea from "@/components/TextArea";
import { OtController } from "@/api/controllers/ot";

const EmployeeByIdPage = () => {
  const SUPPORT_MIME_TYPE = ["image/jpeg", "image/jpeg", "image/png"];
  const { user: profile, refetch } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();
  const isEdit = !!router.query?.id && router.query?.id !== "create";
  const [user, setEmployee] = useState<{ data: any; isLoading: boolean }>({
    data: {},
    isLoading: true,
  });
  const [avatar, setAvatar] = useState<{
    file: File | null;
    image: any;
  }>({
    file: null,
    image: null,
  });
  const [isValidMobile, setIsValidMobile] = useState(false);
  const [formValid, setFormValid] = useState(isEdit);
  const [roles, setRoles] = useState({ data: [], loading: true });

  const [list, setList] = useState<{ campaigns?: any }>({
    campaigns: [],
  });

  const [meta, setMeta] = useState<IMeta>({
    currentPage: 1,
    totalPages: 4,
  });
  const [searchCampaign, setSearchCampaign] = useState("");

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 100,
    search: "",
  });

  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setFormValid(true);
      },
      () => {
        setFormValid(false);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useQuery(
    "role-user",
    () => EmployeesController().getEmployeeById(router.query?.id as string),
    {
      onSuccess: (res) => {
        if (!res.data.roles) {
          return setRoles({ data: [], loading: false });
        }

        const roles = res.data.roles.sort((a: any, b: any) => {
          if (lowerCase(a?.code) === "admin") {
            return -1;
          }
          if (lowerCase(b?.code) === "admin") {
            return 1;
          }
          return a?.code.localeCompare(b?.code);
        });
        setRoles({ data: roles, loading: false });
      },
      onError: () => {
        setRoles({ data: [], loading: false });
      },
    }
  );

  useEffect(() => {
    if (router.isReady && router.query?.id === "create") {
      setEmployee({ data: {}, isLoading: false });
    }
  }, [router.isReady, router.query]);

  useQuery(
    "user-by-id",
    () => OtController().getOtById(router.query?.id as string),
    {
      enabled: isEdit,
      onSuccess: async (res) => {
        if (res?.data) {
          const data = res?.data;
          setEmployee({
            data: { ...data /* role: data?.role?._id */ },
            isLoading: false,
          });

          if (data?.avatar) {
            setAvatar({
              file: null,
              image: `${PATH_AVATAR}/${data?._id}?t=${Dayjs().valueOf()}`,
            });
          }

          setFormValid(true);
          // setIsValidMobile(true);
        }
      },
      onError: async () => {
        // router.replace("/employee").then(() =>
        //   Alert.error({
        //     message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
        //   })
        // );
      },
    }
  );

  const { isFetching: isFetchingCampaignDropDown } = useQuery(
    ["campaign-list-dropdown", { ...queryParams }],
    () =>
      EmployeesController().getEmployeeList({
        limit: queryParams.limit,
        skip: queryParams.page,
        search: queryParams.search,
      }),
    {
      onSuccess: (res: any) => {
        const data = res?.result?.items;
        setMeta(res?.result?.meta);
        const items = data.map((item: any) => {
          return {
            label: item.fullname,
            value: item._id,
            campaignID: item._id,
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

  const { mutate: createOt, isLoading: isLoadingAdd } = useMutation(
    OtController().createOt,
    {
      onSuccess: async () => {
        router.push("/ot").then(() =>
          Alert.success({
            message: `OT ${RESPONSE_MESSAGE.CREATED_SUCCESS}`,
          })
        );
      },
      onError: async (err: any) => {
        const description = mapMessageError(err?.response?.data);
        Alert.error({ message: description });
      },
    }
  );

  const { mutate: updateOt, isLoading: isLoadingUpdate } = useMutation(
    OtController().updateOtById,
    {
      onSuccess: async () => {
        router.push("/ot").then(() => {
          Alert.success({
            message: `OT ${RESPONSE_MESSAGE.UPDATED_SUCCESS}`,
          });

          if (router?.query?.id === profile?._id) {
            refetch();
          }
        });
      },
      onError: async (err: any) => {
        const description = mapMessageError(err?.response?.data);
        Alert.error({ message: description });
      },
    }
  );

  const onFinishForm = (values: any) => {
    
    const start = values.start_overtime ? values.start_overtime.toISOString(): null;
    const end = values.end_overtime ? values.end_overtime.toISOString() : null;
    
    const payload: OtValue = {
      start_overtime: start,
      end_overtime: end,
      overtime_desc: values.overtime_desc,
      employee_id: values.employee_id,
      total_ot_day: 0
    };
    
    console.log("payload", payload);
    if (isEdit) {
      return Confirm({
        typeText: "edit",
        onOk: () => updateOt({ id: router.query?.id as string, data: payload }),
      });
    }

    Confirm({
      typeText: "add",
      onOk: () => createOt(payload),
    });
  };

  const onCancel = () => {
    Confirm({
      title: "Cancel edit user?",
      typeText: "cancel",
      pageText: "user",
      onOk: () => router.push(`/users`),
    });
  };

  const onClear = () => {
    form.resetFields();
    // setFormValid(false);
    onRemoveAvatar();
  };

  // const onFormValueChange = () => {
  //   const hasValue = Object.values(form.getFieldsValue()).every(
  //     (value) => value
  //   );
  //   const isNoError = form.getFieldsError().every((item) => {
  //     if (item.name.includes("mobileNumber")) return true;
  //     return item.errors.length === 0;
  //   });
  //   setFormValid(hasValue && isNoError);
  // };
  const onChangeUpload = ({ file }: UploadChangeParam) => {
    const rawFile = file.originFileObj as File;
    new Compressor(rawFile, {
      quality: 0.8,
      maxWidth: 500,
      success(result) {
        setAvatar({
          file: rawFile,
          image: URL.createObjectURL(result),
        });
      },
      async error(error) {
        const src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj as RcFile);
          reader.onload = () => resolve(reader.result as string);
        });
        setAvatar({ file: rawFile, image: src });
      },
    });
  };

  const onValidateUpload = (file: RcFile) => {
    const SIZE_LIMIT = 5;
    const fileSize = file.size / 1000 / 1000;
    if (fileSize > SIZE_LIMIT) {
      Alert.warning({
        message: `The Maximum file size allowed is ${SIZE_LIMIT} MB.`,
      });
      return Upload.LIST_IGNORE;
    }

    if (!SUPPORT_MIME_TYPE.includes(file.type)) {
      Alert.warning({
        message:
          "Invalid file type. Allowed type .jpeg, .jpg, and .png format.",
      });
      return Upload.LIST_IGNORE;
    }
  };

  const onRemoveAvatar = () => {
    setAvatar({ file: null, image: null });
  };

  const mobileNumberValidator = (_: any, value: string): Promise<any> => {
    if (!value) {
      setIsValidMobile(false);
      return Promise.reject(new Error("Please fill Mobile No."));
    }
    if (!new RegExp(/^0/g).test(value)) {
      setIsValidMobile(false);
      return Promise.reject(new Error(`Mobile No. must start with 0`));
    }
    if (value.length !== 10) {
      setIsValidMobile(false);
      return Promise.reject(new Error(`Please fill Mobile No.`));
    }
    setIsValidMobile(true);
    return Promise.resolve();
  };

  const isDisabledSave = useMemo(() => {
    return !formValid;
  }, [formValid, isLoadingUpdate, user.isLoading]);
  // const isDisabledSave = useMemo(() => {
  //   return !formValid || !isValidMobile || isLoadingAdd || isLoadingUpdate;
  // }, [formValid, isLoadingAdd, isLoadingUpdate, isValidMobile]);

  const handleChange = async (value: string) => {
    if (value != undefined) {
      // setErrorObj({});
      // await getCampaignById(value);
    } else {
      form.resetFields();
      // setUploadFile({ file: null, name: null });
    }
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

  const disabledDate = (current: any) => {
    const today = dayjs().startOf("day");

    // if (!endDate) return false;

    // Allow selection only between today and endDate
    return dayjs(current).isBefore(today);
  };

  return (
    <>
      <Row className="align-baseline">
        <Typography.Title weight={500}>OT</Typography.Title>
        <Typography.Text weight={400} size="18" className="ml-5">
          {isEdit ? "Edit OT" : "Add OT"}
        </Typography.Text>
        <Typography.Link
          size="18"
          href={"/ot"}
          className="ml-3"
        >{`<< Back to all OT`}</Typography.Link>
      </Row>

      <Card className="mt-5 mb-5">
        {!router.query?.id ? (
          // {user.isLoading || !router.query?.id ? (
          <Row className="mt-5" justify="center">
            <Loading />
          </Row>
        ) : (
          <Loading spinning={isLoadingAdd || isLoadingUpdate}>
            {/* <Loading spinning={isLoadingAdd || isLoadingUpdate || user.isLoading}> */}
            <Form
              form={form}
              colon={false}
              name="user"
              onFinish={onFinishForm}
              layout="vertical"
              autoComplete="off"
              labelAlign="left"
              initialValues={{ ...user.data }}
            >
              <Row justify="center" className="pt-2 py-2">
                <Col span={23}>
                  <Form.Item
                    label="Choose Employee"
                    name="employee_id"
                    rules={[
                      {
                        required: true,
                        message: "Employee is required",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      allowClear={false}
                      onPopupScroll={onScroll}
                      onChange={handleChange}
                      maxLengthSearch={100}
                      onSearch={onSearchCampaign}
                      placeholder="Select / Search Employee"
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
                </Col>
                <Col span={11}>
                  <Form.Item
                    label="Start Date/Time"
                    name="start_overtime"
                    initialValue={dayjs()}
                    rules={[
                      {
                        required: true,
                        message: "Start Date/Time is required",
                      },
                    ]}
                  >
                    <DatePicker
                      showTime={{ format: "HH:mm" }}
                      className="full-width"
                      size="large"
                      placeholder="Start Date/Time To e.g. 05-01-2026 14:55"
                      format={"DD-MM-YYYY HH:mm"}
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                  <Form.Item
                    label="End Date/Time"
                    name="end_overtime"
                    initialValue={dayjs()}
                    rules={[
                      {
                        required: true,
                        message: "End Date/Time is required",
                      },
                    ]}
                  >
                    <DatePicker
                      showTime={{ format: "HH:mm" }}
                      className="full-width"
                      size="large"
                      placeholder="End Date/Time To e.g. 05-01-2026 14:55"
                      format={"DD-MM-YYYY HH:mm"}
                      allowClear
                    />
                  </Form.Item>
                </Col>

                <Col span={23}>
                  <Form.Item
                    label="Description"
                    name="overtime_desc"
                    rules={[
                      {
                        required: true,
                        message: "Description is required",
                      },
                    ]}
                  >
                    <TextArea
                      maxLength={255}
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Loading>
        )}
      </Card>

      <Space className="position-absolute bottom-10 mb-10">
        <Button
          type="primary"
          onClick={() => form.submit()}
          icon={<CheckIcon />}
          loading={isLoadingAdd || isLoadingUpdate}
          disabled={isDisabledSave}
        >
          {isEdit ? "Save" : "Add"}
        </Button>
        {isEdit ? (
          <Button
            className="ml-2"
            onClick={() => onCancel()}
            loading={isLoadingUpdate}
            disabled={isLoadingUpdate}
            icon={<CloseIcon className="fill-primary" />}
          >
            Cancel
          </Button>
        ) : (
          <Button
            className="ml-2"
            icon={<ResetIcon className="fill-primary" />}
            onClick={() => onClear()}
            loading={isLoadingAdd}
            disabled={isLoadingAdd}
          >
            Reset
          </Button>
        )}
      </Space>
    </>
  );
};

interface IMeta {
  currentPage: number;
  totalPages: number;
}

interface OtValue {
  start_overtime: string | null;
  end_overtime: string | null;
  overtime_desc: string | null;
  total_ot_day?: number | null;
  employee_id: string | null;
}

export default EmployeeByIdPage;
