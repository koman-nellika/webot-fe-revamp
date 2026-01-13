import { Avatar, Button, Flex, Row } from "antd";
import { RowSelectMethod, TableRowSelection } from "antd/lib/table/interface";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

import Alert from "@/components/Alert";
import Confirm from "@/components/Confirm";
import {
  CloseIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  PlusIcon,
} from "@/components/Icons";
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
import { OtController } from "@/api/controllers/ot";
import { useSession } from "next-auth/react";
import saveAs from "file-saver";

const Table = dynamic(import("@/components/Table"), { ssr: false });
const SearchUsers = dynamic(import("@/components/SearchBox/SearchUsers"), {
  ssr: false,
});

const UserPage = () => {
  const router = useRouter();
  // const { isAdmin } = useAuth();
  // const { user } = useAuth();
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = session?.isAdmin;
  const {
    data: queryParams,
    onPagination,
    onPaginationLimit,
    onClearSearch,
    onPressSearch,
  } = useSearch();
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
      OtController().getOtList({
        limit: queryParams.limit,
        skip: queryParams.skip,
        sort: sortBy.field || undefined,
        order: sortBy.order || undefined,
        ...queryParams.search,
      }),
    {
      keepPreviousData: true,
    }
  );

  const { mutate: deleteUser, isLoading: isLoadingDelete } = useMutation(
    OtController().deleteOtById,
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

  const { mutate: onExportFile, isLoading: isLoadingExport } = useMutation(
    OtController().exportOt,
    {
      onSuccess: async (res: any) => {
        const file = new Blob([res]);
        saveAs(file, `ot_${Dayjs().format("YYYYMMDDHHmmss")}.pdf`);
        Alert.success({
          message: `Ot ${RESPONSE_MESSAGE.EXPORTED_SUCCESS}`,
        });
      },
      onError: async (err: any) => {
        const description = mapMessageError(err?.response?.data);
        Alert.error({ message: description });
      },
    }
  );

  const onExport = (type: any) => {
    // console.log("selectedRows", selectedRows);
    // console.log("users?.result?.items", users?.result?.items);
    const employeeIds = users?.result?.items
      ?.filter((item) => selectedRows.includes(item._id))
      ?.map((item) => item.employee_id)
      ?.join(","); // ✅ แปลงเป็น string
    console.log("employeeIds", employeeIds);

    onExportFile({
      employee_id: employeeIds, // หรือ join เป็น string ถ้า backend ต้องการ
    });

    // const exportPayload: { campaignID: string; reserve_1: string }[] =
    //   selectedRows.map((item) => ({
    //     campaignID: item?.campaignID || "",
    //     reserve_1: item.reserve_1 || "",
    //   }));

    // if (type === "All") {
    //   onExportFile({
    //     ...queryParams.search,
    //     sort: sortBy.field || undefined,
    //     order: sortBy.order || undefined,
    //   });
    // } else {
    //   onExportFile({ employee_id: "" });
    // }
  };

  const onEdit = (id: string) => {
    return router.push(`/ot/${id}`);
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
      title: "Name",
      dataIndex: ["employee_info", "fullname"],
      key: "fullname",
      sorter: true,
      sortOrder: checkResetSortOrder("employee_info.fullname"),
      render: (value: string) => (
        <Typography.Text size="20">{value || "-"}</Typography.Text>
      ),
    },
    {
      title: "Position",
      dataIndex: "position_id",
      key: "position_id",
      sorter: true,
      sortOrder: checkResetSortOrder("position_id"),
      render: (value: string) => (
        <Typography.Text size="20">{value || "-"}</Typography.Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "overtime_bk",
      key: "overtime_bk",
      // width: 250,
      sorter: true,
      sortOrder: checkResetSortOrder("overtime_bk"),
      render: (value: string) => (
        <Typography.Text size="20">{value || "-"}</Typography.Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "overtime_desc",
      key: "overtime_desc",
      // width: 250,
      render: (value: string) => (
        <Typography.Text size="20">{value || "-"}</Typography.Text>
      ),
    },
    {
      title: "Time",
      dataIndex: "",
      key: "time",
      sorter: true,
      render: (_: string, record: any) => (
        <Typography.Text size="20">
          {`${record.time_start} - ${record.time_end}` || "-"}
        </Typography.Text>
      ),
    },
    {
      title: "Over Time",
      dataIndex: "duration_text",
      key: "name",
      width: 150,
      render: (value: string) => (
        <Typography.Text size="20">{value || "-"}</Typography.Text>
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
                // onClick={() => (isMe ? {} : onDelete([record._id]))}
              />
            );
          },
        },
      ],
    },
  ].filter((item) => !item.hidden);

  const onAdd = () => {
    return router.push(`/ot/create`);
  };

  const userSortField = (pagination: any, filter: any, sorter: any) => {
    if (users?.result?.items?.length === 0) return;
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
        <Typography.Title weight={500}>OT</Typography.Title>
        <ShowEntries page={users?.result?.meta} />

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
                  type="primary"
                  size="large"
                  icon={<DownloadIcon />}
                  disabled={isLoadingExport || isLoadingDelete}
                  loading={isLoadingExport || isLoadingDelete}
                  onClick={() => onExport("Rows")}
                >
                  Export
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
                Add OT
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
          scroll={getScroll(users?.result?.items as any[])}
          columns={usersColumns}
          dataSource={users?.result.items || []}
          pagination={{
            pageSize: queryParams.limit,
            current: queryParams.skip,
            total: users?.result?.meta?.total_items,
            onPaginationLimit: (limit: number) => onPaginationLimit(limit),
            onChange: (currentPage) =>
              onPagination({
                currentPage,
                isPreviousData,
                totalPage: users?.result?.meta?.total_items,
              }),
          }}
          onChange={userSortField}
        />
      </Loading>
    </>
  );
};

export default UserPage;
