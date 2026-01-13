import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Upload,
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
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
import { lowerCase } from "lodash";
import { EmployeesController } from "@/api/controllers/employee";

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
    () => EmployeesController().getEmployeeById(router.query?.id as string),
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

  const { mutate: createEmployee, isLoading: isLoadingAdd } = useMutation(
    EmployeesController().createEmployee,
    {
      onSuccess: async () => {
        router.push("/employee").then(() =>
          Alert.success({
            message: `Employee ${RESPONSE_MESSAGE.CREATED_SUCCESS}`,
          })
        );
      },
      onError: async (err: any) => {
        const description = mapMessageError(err?.response?.data);
        Alert.error({ message: description });
      },
    }
  );

  const { mutate: updateEmployee, isLoading: isLoadingUpdate } = useMutation(
    EmployeesController().updateEmployeeById,
    {
      onSuccess: async () => {
        router.push("/employee").then(() => {
          Alert.success({
            message: `Employee ${RESPONSE_MESSAGE.UPDATED_SUCCESS}`,
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
    const formData = new FormData();

    for (const key in values) {
      formData.append(key, values[key]);
    }

    if (avatar.file) {
      formData.append("file", avatar.file);
    }

    if (user.data?.avatar && !avatar.image) {
      formData.append("avatar", "");
    }

    if (isEdit) {
      return Confirm({
        typeText: "edit",
        onOk: () =>
          updateEmployee({ id: router.query?.id as string, data: values }),
      });
    }

    Confirm({
      typeText: "add",
      onOk: () => createEmployee(values),
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
    return (
      !formValid ||
      !isValidMobile ||
      isLoadingAdd ||
      isLoadingUpdate 
    );
  }, [formValid, isLoadingAdd, isLoadingUpdate, isValidMobile]);

  return (
    <>
      <Row className="align-baseline">
        <Typography.Title weight={500}>Employee</Typography.Title>
        <Typography.Text weight={400} size="18" className="ml-5">
          {isEdit ? "Edit Employee" : "Add Employee"}
        </Typography.Text>
        <Typography.Link
          size="18"
          href={"/employee"}
          className="ml-3"
        >{`<< Back to all Employee`}</Typography.Link>
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
              // onFieldsChange={onFormValueChange}
              layout="vertical"
              autoComplete="off"
              labelAlign="left"
              initialValues={{ ...user.data }}
            >
              <Row justify="center" className="pt-2 py-2">
                {/* <Col span={24}>
                  <Row justify="center" align="middle">
                    <Col className="text-center" span={24}>
                      <Avatar
                        className="bg-grey-200 border-grey-200"
                        size={150}
                        icon={<UserOutlined />}
                        src={avatar.image}
                      />
                    </Col>
                    <Col className="mt-5 mb-10">
                      <Row justify="center" align="middle">
                        <Col className="text-center">
                          <Upload
                            name="avatar"
                            onChange={onChangeUpload}
                            beforeUpload={onValidateUpload}
                            showUploadList={false}
                            accept={SUPPORT_MIME_TYPE.join(",")}
                            customRequest={() => {}}
                            maxCount={1}
                          >
                            <Button block icon={<UploadIcon />}>
                              Browse
                            </Button>
                          </Upload>
                        </Col>
                        {avatar.image && (
                          <Col className="text-center" offset={1}>
                            <Button
                              block
                              danger
                              className="fill-white"
                              icon={<DeleteIcon />}
                              onClick={() => onRemoveAvatar()}
                            >
                              Remove
                            </Button>
                          </Col>
                        )}
                        <Col className="text-center" span={24}>
                          <Typography.Text className="text-grey-300" size="18">
                            (รองรับไฟล์ .jpeg, .jpg, .png ขนาดไม่เกิน 5 MB)
                          </Typography.Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col> */}
                <Col span={11}>
                  <Form.Item
                    label="Firstname"
                    name="first_name"
                    rules={[
                      {
                        required: true,
                        message: "Please fill Firstname",
                      },
                    ]}
                    normalize={(value: string) =>
                      value.replace(/[^a-zA-Zก-๙0-9]/g, "").trim()
                    }
                  >
                    <Input size="small" maxLength={50} />
                  </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                  <Form.Item
                    label="Lastname"
                    name="last_name"
                    rules={[
                      {
                        required: true,
                        message: "Please fill Lastname",
                      },
                    ]}
                    normalize={(value: string) =>
                      value.replace(/[^a-zA-Zก-๙0-9]/g, "").trim()
                    }
                  >
                    <Input size="small" maxLength={50} />
                  </Form.Item>
                </Col>

                <Col span={11}>
                  <Form.Item
                    label="Mobile No."
                    name="phone_number"
                    rules={[
                      {
                        required: true,
                        validator: mobileNumberValidator,
                      },
                    ]}
                    normalize={(value) => value.replace(/[^0-9]/g, "")}
                  >
                    <Input
                      size="small"
                      type="mobileNumber"
                      minLength={10}
                      maxLength={10}
                    />
                  </Form.Item>
                </Col>

                <Col span={11} offset={1}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please fill Email",
                      },
                      {
                        pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: "Please fill a valid email",
                      },
                    ]}
                  >
                    <Input size="small" type="email" maxLength={100} />
                  </Form.Item>
                </Col>

                {isEdit ?? (
                  <>
                    <Col span={11}>
                      <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input.Password size="small" />
                      </Form.Item>
                    </Col>

                    <Col span={11} offset={1}>
                      <Form.Item
                        name="confirm_password"
                        label="Confirm Password"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "Please confirm your password!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  "The new password that you entered do not match!"
                                )
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password size="small" />
                      </Form.Item>
                    </Col>
                  </>
                )}

                <Col span={11}>
                  <Form.Item
                    label="Position"
                    initialValue={"694129d97d9e44af2d61f55c"}
                    name="position_id"
                    rules={[
                      {
                        required: true,
                        message: "Please fill Position",
                      },
                      // {
                      //   min: 3,
                      //   message: "Please fill Username 3 or more characters.",
                      // },
                    ]}
                    // normalize={(value: string) =>
                    //   value.replace(/[^a-zA-Z0-9_.]/g, "").trim()
                    // }
                  >
                    <Input size="small" maxLength={24} />
                  </Form.Item>
                </Col>
                {/* <Col span={11} offset={1}>
                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: "Please select Role" }]}
                  >
                    <Select
                      size="large"
                      placeholder="Select / Search Role"
                      options={[
                        { value: ROLE.ADMIN, label: "Admin" },
                        { value: ROLE.VIEWER, label: "Viewer" },
                      ]}
                    ></Select>
                  </Form.Item>
                </Col> */}
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
          loading={isLoadingAdd || isLoadingUpdate }
          disabled={isDisabledSave}
        >
          {isEdit ? "Save" : "Add"}
        </Button>
        {isEdit ? (
          <Button
            className="ml-2"
            onClick={() => onCancel()}
            loading={isLoadingUpdate }
            disabled={isLoadingUpdate }
            icon={<CloseIcon className="fill-primary" />}
          >
            Cancel
          </Button>
        ) : (
          <Button
            className="ml-2"
            icon={<ResetIcon className="fill-primary" />}
            onClick={() => onClear()}
            loading={isLoadingAdd }
            disabled={isLoadingAdd }
          >
            Reset
          </Button>
        )}
      </Space>
    </>
  );
};

export default EmployeeByIdPage;
