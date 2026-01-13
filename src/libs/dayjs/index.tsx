import dayjs from "dayjs";

import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(timezone);
dayjs.extend(utc);

export const Dayjs = dayjs;

export const getThaiDateTime = (
  date: Date | string,
  format = "YYYY-MM-DD HH:mm:ss",
) => {
  return date ? dayjs(date).tz("Asia/Bangkok").format(format) : null;
};
