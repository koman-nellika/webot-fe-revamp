/* eslint-disable @typescript-eslint/no-var-requires */
const { loadEnvConfig } = require('@next/env');
loadEnvConfig('./', process.env.NODE_ENV !== 'production');

const dayjs = require('dayjs');
const winston = require('winston');
require('winston-daily-rotate-file');
const kafka = require('./kafka');

const isEnabledLog = process.env.LOG_ENABLED === 'true';
let fileLogger;

const formatLog = (message) => {
  let log = '';
  if (typeof message !== 'object') return message;

  for (const key in message) {
    let value = '';
    if (typeof message[key] === 'object') {
      value = JSON.stringify(message[key]).replace(/\|/g, ' ');
    } else if (typeof message[key] === 'string') {
      value = message[key].replace(/\|/g, ' ');
    } else {
      value = message[key];
    }
    log += `${key}|${value}|`;
  }

  log = log.replace(/\|$/, '');
  return log;
};

const parseData = (data) => {
  if (!data) return '-';
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return JSON.stringify({ data });
  return JSON.stringify(data);
};

const maskingData = (data) => {
  if (!data || data === '-') return '-';
  try {
    const payload = JSON.parse(data);
    if (payload.mobileNo) {
      payload.mobileNo = payload.mobileNo.replace(
        /^(\d{0,4})(\d{0,3})(\d{0,4})/,
        '$1XXX$3',
      );
    }
    return JSON.stringify(payload);
  } catch (error) {
    return data;
  }
};

const getTimestamp = () => {
  return dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS');
};

const getResponseTime = (target) => {
  return dayjs(new Date()).diff(dayjs(target), 'ms');
};

const writeLog = (message, format = true) => {
  if (fileLogger) {
    const result = format ? formatLog(message) : message;
    fileLogger.info(result);
    fileLogger.close();
    fileLogger.clear();
  }
};

const createLoggerFile = (logType) => {
  const format = winston.format.printf(({ message }) => {
    return JSON.stringify(message);
  });

  const transports = [
    new winston.transports.DailyRotateFile({
      filename: `${logType}.log.%DATE%`,
      datePattern: 'YYYYMMDD_HHmm',
      frequency: process.env.LOG_ROTATE_TIME,
      dirname: `${process.env.LOG_PATH}/${logType}`,
    }),
  ];

  fileLogger = winston.createLogger({
    format,
    transports: [...transports],
  });
};

const access = (request, response) => {
  if (isEnabledLog) {
    createLoggerFile('access');
  }
  const message = {
    TIMESTAMP: getTimestamp(),
    LOGTYPE: response.statusCode >= 400 ? `ERROR` : `INFO`,
    IP:
      request.socket?.remoteAddress ||
      request.headers?.['x-forwarded-for'] ||
      '',
    URI: request.originalUrl || request.path || '',
    REQUESTID: request.requestId,
    METHOD: request.method?.toUpperCase() || '',
    PARAMS: maskingData(parseData(request.body)),
    CACHE_STATUS: request.headers?.['cache-control'] || 'MISS',
    RESULT: response?.statusMessage || '',
    RESULT_CODE: response.statusCode || '',
    RESPONSE_BODY: parseData(response.rawResponseBody) || '',
    RESPTIME: getResponseTime(request.startTime) || 0,
    SITE: process.env.LOG_SITE_NAME,
    TOPIC: process.env.LOG_TOPIC_NAME,
  };
  kafka.send({ type: 'access', message });
  return writeLog(message);
};

module.exports = {
  access,
};
