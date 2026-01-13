import dayjs from "dayjs";

export const getThaiDateTime = (
  date: Date | string,
  format = "YYYY-MM-DD HH:mm:ss",
) => {
  return date ? dayjs(date).tz("Asia/Bangkok").format(format) : null;
};

export const rangeTime = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export const disabledStartDate = (date: Date, endDate: Date) => {
  return (
    date &&
    endDate &&
    dayjs(date).startOf("day").valueOf() >
    dayjs(endDate).startOf("day").valueOf()
  );
};

export const disabledEndDate = (date: Date, startDate: Date) => {
  return (
    date &&
    startDate &&
    dayjs(date).startOf("day").valueOf() <
    dayjs(startDate).startOf("day").valueOf()
  );
};

export const disabledStartTime = (start: Date | string, end: Date | string) => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  if (!startDate.isSame(endDate, "dates")) {
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  }

  return {
    disabledHours: () => rangeTime(0, 24).splice(endDate.hour() + 1, 24),
    disabledMinutes: () => {
      return startDate.hour() === endDate.hour()
        ? rangeTime(0, 59).splice(endDate.minute() + 1, 59)
        : [];
    },
    disabledSeconds: () => {
      return startDate.hour() === endDate.hour() &&
        startDate.minute() === endDate.minute()
        ? rangeTime(0, 59).splice(endDate.second() + 1, 59)
        : [];
    },
  };
};

export const disabledStopTime = (start: Date | string, end: Date | string) => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  if (startDate.isSame(endDate, "dates")) {
    return {
      disabledHours: () =>
        rangeTime(0, 24).splice(
          0,
          Number(startDate.hour()),
          24 - Number(startDate.hour()),
        ),
      disabledMinutes: () => {
        return startDate.hour() === endDate.hour()
          ? rangeTime(0, 59).splice(
            0,
            Number(startDate.minute()),
            24 - Number(startDate.minute()),
          )
          : [];
      },
      disabledSeconds: () => {
        return startDate.hour() === endDate.hour() &&
          startDate.minute() === endDate.minute()
          ? rangeTime(0, 59).splice(
            0,
            Number(startDate.second()) + 1,
            24 - Number(startDate.second()),
          )
          : [];
      },
    };
  }

  return {
    disabledHours: () => [],
    disabledMinutes: () => [],
    disabledSeconds: () => [],
  };
};

export const transformTime = (time: string) => {
  const Time = time?.slice(0, 2)
  const convertTime = `${Time}:00 - ${Time}:30`
  return convertTime
}
