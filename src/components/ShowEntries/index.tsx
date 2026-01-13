import { memo, useMemo } from "react";
import Typography from "../Typography";
import { IMeta } from "@/api/interfaces/base.interface";

const ShowEntries = ({ page }: ShowEntriesProps) => {
  // const currentPage = (page?.current_page ?? 0) + 1; /* ใช้ในกรณีที่ ส่ง current_page เป็น 0 */
  const currentPage = (page?.current_page ?? 1); /* ใช้ในกรณีที่ ส่ง current_page เป็น 1 */
  const perPage = page?.items_per_page ?? 10;

  const start = useMemo(() => {
    return (currentPage - 1) * perPage + 1;
  }, [currentPage, perPage]);

  const end = useMemo(() => {
    return Math.min(currentPage * perPage, page?.total_items ?? 0);
  }, [currentPage, perPage, page?.total_items]);

  return (
    <Typography.Text size="20" className="ml-7">
      Showing {start} to {end} of {(page?.total_items || 0).toLocaleString()}{" "}
      entries.
    </Typography.Text>
  );
};

type ShowEntriesProps = {
  page?: IMeta;
};

export default memo(ShowEntries);
