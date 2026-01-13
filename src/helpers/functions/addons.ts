import { Dayjs } from "@/libs/dayjs";

export const isServer = typeof window === "undefined";

export const truncate = (str: string, num: number): string => {
  if (!str) return "";
  return str.length > num ? str.slice(0, num) + "..." : str;
};

export const getScroll = (items: any[], xCustom?: string | number) => {
  return {
    x: xCustom ?? 1200,
    y: items?.length > 10 ? 750 : undefined,
  };
};

export const capitalize = (str: string) => {
  return str.replace(/^\w/, (c) => c.toUpperCase())
}

export const hasValue = (obj: object): boolean => {
  if (Object.keys(obj).length === 0) return false;
  return Object.values(obj).some((item) => !!item);
};

export const mappingOrder = (order?: "descend" | "ascend" | null) => {
  if (order === "ascend") return "asc";
  if (order === "descend") return "desc";
  return "";
};

export const check66 = (value: string, type?: string) => {
  if (value.startsWith("66") && value.length === 11) {
    return type === "X"
      ? value.replace(/^66(\d{0,2})(\d{0,3})(\d{0,4})/, "0$1XXX$3")
      : value.replace(/^66/, "0");
  }
  return value;
};

export const validateDecimal = (value: string) => {
  // Remove non-digits and leading zeros
  const normalizedValue = value.replace(/[^0-9.]/g, "");

  // Ensure there's only one dot and digits after dot if present
  const dotIndex = normalizedValue.indexOf(".");
  if (dotIndex !== -1) {
    const afterDot = normalizedValue.substring(dotIndex + 1);
    const validAfterDot = afterDot.replace(/[^\d]/g, "");
    return `${normalizedValue.substring(0, dotIndex)}.${validAfterDot}`;
  }

  return normalizedValue;
};
export const validateOverZero = (value: string) => {
  // Remove all characters except digits
  const cleanedValue = value.replace(/[^\d]/g, "");

  // Check if the cleaned value is greater than 0
  const numericValue = parseFloat(cleanedValue);
  const normalizedValue = numericValue > 0 ? String(numericValue) : "";

  return normalizedValue;
};

export const isEmpty = (obj: any) =>
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;

export const notEmpty = (obj: any) => !isEmpty(obj);

export const checkDateTime = (data: string) => {

  var showDateTime = "-"

  // ✅ ตรวจสอบว่า data มีความยาวไม่เกิน 12 ตัวก่อน
  const isValidLength = data?.length > 0 && data.length <= 12;

  if (isValidLength) {
    // ✅ ลบอักขระที่ไม่ใช่ตัวเลขออก
    const cleanedValue = data.replace(/[^0-9]/g, "");

    // ✅ ตรวจสอบว่าความยาวหลัง clean ต้องไม่เกิน 12 ตัว
    const hasValidFormat = cleanedValue.length > 0 && cleanedValue.length <= 12;

    // ✅ แปลงวันที่
    const date = hasValidFormat
      ? Dayjs(cleanedValue.substring(0, 8), "YYYYMMDD", true).isValid()
        ? Dayjs(cleanedValue.substring(0, 8)).format("DD-MM-YYYY")
        : null
      : null;

    // ✅ แปลงเวลา
    const time = hasValidFormat && cleanedValue.length === 12
      ? Dayjs(cleanedValue.substring(8, 12), "HHmm", true).isValid()
        ? Dayjs(cleanedValue.substring(8, 12), "HHmm").format("HH:mm")
        : null
      : null;
    showDateTime = time ? `${date} ${time}` : date ? date : "-";
  }
  return showDateTime
}
export const checkDate = (data: string) => {
  // ลบอักขระที่ไม่ใช่ตัวเลขออก
  const cleanedValue = data?.replace(/[^0-9]/g, "") || "";

  // พยายามแปลงเป็นวันที่ และตรวจสอบว่าถูกต้องหรือไม่
  const date = data
    ? Dayjs(cleanedValue.substring(0, 8), "YYYYMMDD").isValid()
      ? Dayjs(cleanedValue.substring(0, 8), "YYYYMMDD").format(
        "DD-MM-YYYY"
      )
      : null
    : null;
  const showDate = date ? date : "-";

  return showDate
}

export function assertValidId(id: string, title: string = "") {
  if (!/^[0-9a-fA-F-]{24}$/.test(id)) { // UUID example
    throw new Error(`Invalid ${title} ID`);
  }
}
