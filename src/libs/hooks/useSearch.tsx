import { hasValue } from "@/helpers/functions/addons";
import { useCallback, useState } from "react";

interface IOnPagination {
  isPreviousData: boolean;
  currentPage: number;
  totalPage?: number;
}

export const useSearch = () => {
  // const [queryParams, setQueryParams] = useState({
  //   page: 1,
  //   limit: 10,
  //   search: {},
  // });

  const [queryParams, setQueryParams] = useState<{
    skip: number;
    limit: number;
    search: Record<string, any>; // เปลี่ยนเป็น Record<string, any> เพื่อให้รองรับ object ที่เปลี่ยนแปลงได้
  }>({
    skip: 1,
    limit: 10,
    search: {}, // ค่าเริ่มต้นเป็น object เปล่า
  });

  const onPressSearch = useCallback((values: Record<string, any>) => {
    // if (hasValue(values)) {
    setQueryParams((prevState) => ({
      ...prevState,
      page: 1,
      search: values,
    }));
    // }
  }, []);

  const onClearSearch = useCallback(() => {
    setQueryParams(() => ({
      skip: 1,
      limit: 10,
      search: {},
    }));
  }, []);

  const onPagination = useCallback(
    ({ isPreviousData, currentPage, totalPage = 0 }: IOnPagination) => {
      if (!isPreviousData && currentPage <= totalPage) {
        setQueryParams((prevState) => ({ ...prevState, page: currentPage }));
      }
    },
    []
  );

  const onPaginationLimit = useCallback((limit = 10) => {
    setQueryParams((prevState) => ({ ...prevState, page: 1, limit }));
  }, []);

  return {
    data: queryParams,
    onPressSearch,
    onClearSearch,
    onPagination,
    onPaginationLimit,
  };
};
