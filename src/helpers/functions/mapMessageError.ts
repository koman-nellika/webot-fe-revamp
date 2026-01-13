import { RESPONSE_MESSAGE } from "@/helpers/constants/responseMessage";

interface IErrros {
  code: keyof typeof RESPONSE_MESSAGE;
  messages: string[];
}

interface IResponseError {
  data: keyof typeof RESPONSE_MESSAGE;
  errors: IErrros[];
}

export const mapMessageError = (error: IResponseError) => {
  try {
    if (typeof error.data === "string") {
      return RESPONSE_MESSAGE[error.data] || RESPONSE_MESSAGE.ERROR_SOMETHING;
    }

    // if (!error || !error.errors || error?.errors?.length === 0) {
    //   return RESPONSE_MESSAGE.ERROR_SOMETHING;
    // }

    if (!error?.errors?.length) {
      return RESPONSE_MESSAGE.ERROR_SOMETHING;
    }


    return error.errors
      .map((item: IErrros) => {
        if (
          [
            "DATA_CONFLICT",
            "VALIDATION_FAILED",
            "BALANCE_TRANSFER_ERROR",
            "FILENAME_ALREADY",
            "DUPLICATE_DATA"
          ].includes(item.code)
        ) {
          if (typeof item.messages === "string") return item.messages;
          return item.messages.map((msg: string) => `- ${msg}`).join(`\n`);
        }
        return RESPONSE_MESSAGE[item.code] || RESPONSE_MESSAGE.ERROR_SOMETHING;
      })
      .filter(Boolean)
      .join("\n");
  } catch (error) {
    return RESPONSE_MESSAGE.ERROR_SOMETHING;
  }
};
