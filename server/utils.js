/* eslint-disable @typescript-eslint/no-var-requires */
const dayjs = require("dayjs");
const { v4: uuidv4 } = require("uuid");

const generateRequestId = () => {
  return `WEBOT-${uuidv4()}`;
};

const generateTransactionId = () => {
  return `WEBOT-${dayjs(new Date()).format("YYYYMMDDHHmmss")}`;
};

module.exports = {
  generateRequestId,
  generateTransactionId,
};
