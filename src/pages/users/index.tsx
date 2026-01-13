import { Avatar, Button, Flex, Row } from "antd";
import { RowSelectMethod, TableRowSelection } from "antd/lib/table/interface";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { UsersController } from "@/api/controllers/users";
import Alert from "@/components/Alert";
import Confirm from "@/components/Confirm";
import { CloseIcon, DeleteIcon, EditIcon, PlusIcon } from "@/components/Icons";
import Loading from "@/components/Loading";
import ShowEntries from "@/components/ShowEntries";
import Typography from "@/components/Typography";
import { RESPONSE_MESSAGE } from "@/helpers/constants/responseMessage";
import { PATH_AVATAR } from "@/helpers/constants/utils";
import { getScroll, hasValue, mappingOrder } from "@/helpers/functions/addons";
import { mapMessageError } from "@/helpers/functions/mapMessageError";
import { Dayjs } from "@/libs/dayjs";
import { useAuth } from "@/libs/hooks/useAuth";
import { useSearch } from "@/libs/hooks/useSearch";
import { toLower } from "lodash";

const Table = dynamic(import("@/components/Table"), { ssr: false });
const SearchUsers = dynamic(import("@/components/SearchBox/SearchUsers"), {
  ssr: false,
});

const UserPage = () => {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const {
    data: queryParams,
    onPagination,
    onPaginationLimit,
    onClearSearch,
    onPressSearch,
  } = useSearch();
  const { user } = useAuth();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState({
    field: "",
    order: "",
  });
  const [isReset, setIsReset] = useState(false);

  const {
    data: users,
    isPreviousData,
    isFetching,
    refetch,
  } = useQuery(
    ["user", { ...queryParams, sortBy }],
    () =>
      UsersController().getUserList({
        limit: queryParams.limit,
        page: queryParams.page,
        sort: sortBy.field || undefined,
        order: sortBy.order || undefined,
        ...queryParams.search,
      }),
    {
      keepPreviousData: true,
    }
  );

  const { mutate: deleteUser, isLoading: isLoadingDelete } = useMutation(
    UsersController().deleteUserById,
    {
      onSuccess: async () => {
        Alert.success({
          message: `User ${RESPONSE_MESSAGE.DELETED_SUCCESS}`,
        });
        setSelectedRows([]);
        if (hasValue(queryParams.search)) {
          onReset();
        } else {
          refetch();
        }
      },
      onError: async (err: any) => {
        const description = mapMessageError(err?.response?.data);
        Alert.error({ message: description });
        setSelectedRows([]);
        refetch();
      },
    }
  );

  const onEdit = (id: string) => {
    return router.push(`/users/${id}`);
  };

  const onDelete = (ids: string[] | number[]) => {
    Confirm({
      typeText: "delete",
      onOk: () => deleteUser({ ids }),
    });
  };

  const rowSelection: TableRowSelection<unknown> = {
    selectedRowKeys: selectedRows,
    type: "checkbox",
    columnWidth: 100,
    getCheckboxProps: (record: any) => ({
      disabled: record._id === user?._id,
      name: record.name,
    }),
    onSelect: (record: any, selected: boolean) => {
      const { _id } = record;
      if (selected) {
        return setSelectedRows((prevState) => [...prevState, _id]);
      }
      const rows = selectedRows.filter((item: string) => item !== _id);
      setSelectedRows(rows);
    },
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRecords: any[],
      info: { type: RowSelectMethod }
    ) => {
      if (info.type !== "all") return;
      setSelectedRows(selectedRowKeys as string[]);
    },
  };

  const checkResetSortOrder = (fieldName: string) => {
    if (sortBy.field === fieldName && sortBy.order !== "") {
      return sortBy.order === "asc" ? "ascend" : "descend";
    } else {
      return null;
    }
  };
  useEffect(() => {
    if (hasValue(queryParams.search)) {
      setSelectedRows([]);
    }
  }, [queryParams.search]);

  const usersColumns: any = [
    {
      title: "Image",
      dataIndex: "avatar",
      width: 90,
      key: "avatar",
      align: "center",
      render: (avatar: string, record: any) => (
        <Avatar
          className="avatar"
          size={60}
          src={
            record?.avatar
              ? `${PATH_AVATAR}/${record._id}?t=${Dayjs().valueOf()}`
              : null
          }
        >
          {record?.firstName?.[0]?.toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: "Firstname",
      dataIndex: "firstName",
      key: "firstName",
      sorter: true,
      sortOrder: checkResetSortOrder("firstName"),
      render: (value: string) => (
        <Typography.Text size="20">{value || "-"}</Typography.Text>
      ),
    },
    {
      title: "Lastname",
      dataIndex: "lastName",
      key: "lastName",
      sorter: true,
      sortOrder: checkResetSortOrder("lastName"),
      render: (value: string) => (
        <Typography.Text size="20">{value || "-"}</Typography.Text>
      ),
    },
    {
      title: "Mobile No.",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      sorter: true,
      sortOrder: checkResetSortOrder("mobileNumber"),
      render: (value: string) => (
        <Typography.Text size="20">{value || "-"}</Typography.Text>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: true,
      sortOrder: checkResetSortOrder("username"),
      render: (value: string) => (
        <Typography.Text size="20">{value || "-"}</Typography.Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      sorter: true,
      sortOrder: checkResetSortOrder("email"),
      render: (value: string) => (
        <Typography.Text size="20">{value || "-"}</Typography.Text>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
      sorter: true,
      sortOrder: checkResetSortOrder("role"),

      render: (value: string) => (
        <Typography.Text size="20">
          {toLower(value) === "admin"
            ? "Admin"
            : toLower(value) === "viewer"
              ? "Viewer"
              : "-"}
        </Typography.Text>
      ),
    },
    {
      title: "Action",
      ellipsis: true,
      hidden: !isAdmin,
      rowSpan: 2,
      colSpan: 2,
      children: [
        {
          title: "",
          dataIndex: "",
          key: "",
          width: 80,
          align: "center",
          className: "table-action",
          colSpan: 0,
          fixed: "right",
          render: (_: string, record: any) => (
            <EditIcon
              className="cursor-pointer"
              onClick={() => onEdit(record._id)}
            />
          ),
        },
        {
          title: "",
          dataIndex: "",
          key: "",
          width: 80,
          align: "center",
          colSpan: 0,
          fixed: "right",
          render: (_: string, record: any) => {
            const isMe = user?._id === record._id;
            return (
              <DeleteIcon
                className={clsx({
                  "cursor-pointer": !isMe,
                  "disabled-icon": isMe,
                })}
                onClick={() => (isMe ? {} : onDelete([record._id]))}
              />
            );
          },
        },
      ],
    },
  ].filter((item) => !item.hidden);

  const onAdd = () => {
    return router.push(`/users/create`);
  };

  const userSortField = (pagination: any, filter: any, sorter: any) => {
    if (users?.data?.items?.length === 0) return;
    const sortFied = Array.isArray(sorter.field)
      ? sorter.field.join(".")
      : sorter.field;
    const order = mappingOrder(sorter.order);
    const obj = {
      field: sortFied,
      order: order ?? "asc",
    };
    setSortBy(obj);
  };

  const onReset = () => {
    setSelectedRows([]);
    // setIsReset(true);
    setIsReset(!isReset);
    setSortBy({ field: "", order: "" });
    onClearSearch();
  };

  const onCancel = () => {
    setSelectedRows([]);
  };

  return (
    <>
      <Row className="align-baseline">
        <Typography.Title weight={500}>User</Typography.Title>
        <ShowEntries page={users?.data?.meta} />

        <Typography.Text
          className="text-primary ml-3"
          size="18"
          onClick={() => onReset()}
        >
          Reset
        </Typography.Text>
      </Row>

      <Row className="mt-5">
        {isAdmin &&
          (selectedRows.length ? (
            <>
              <Flex gap={12}>
                <Button
                  size="large"
                  className="fill-white"
                  icon={<DeleteIcon />}
                  danger
                  block
                  onClick={() => onDelete(selectedRows)}
                  disabled={isLoadingDelete}
                  loading={isLoadingDelete}
                >
                  Delete
                </Button>
                <Button
                  size="large"
                  icon={<CloseIcon className="fill-primary" />}
                  disabled={isLoadingDelete}
                  loading={isLoadingDelete}
                  onClick={() => onCancel()}
                >
                  Cancel
                </Button>
              </Flex>
            </>
          ) : (
            <Flex gap={12}>
              <Button
                type="primary"
                size="large"
                icon={<PlusIcon />}
                block
                onClick={() => onAdd()}
              >
                Add User
              </Button>
            </Flex>
          ))}
      </Row>

      <Loading spinning={isFetching}>
        <SearchUsers
          className="my-5"
          onSearch={onPressSearch}
          onClear={onClearSearch}
          isReset={isReset}
          isLoading={isFetching}
        />

        <Table
          className="mt-5"
          rowKey="_id"
          tableLayout="fixed"
          rowSelection={
            isAdmin
              ? {
                  columnWidth: 100,
                  type: "checkbox",
                  ...rowSelection,
                }
              : undefined
          }
          scroll={getScroll(users?.data?.items as any[])}
          columns={usersColumns}
          dataSource={users?.data.items || []}
          pagination={{
            pageSize: queryParams.limit,
            current: queryParams.page,
            total: users?.data?.meta?.totalItems,
            onPaginationLimit: (limit: number) => onPaginationLimit(limit),
            onChange: (currentPage) =>
              onPagination({
                currentPage,
                isPreviousData,
                totalPage: users?.data?.meta?.totalItems,
              }),
          }}
          onChange={userSortField}
        />
      </Loading>
    </>
  );
};

export default UserPage;
