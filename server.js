/* eslint-disable @typescript-eslint/no-var-requires */
const { loadEnvConfig } = require("@next/env");
const express = require("express");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const {
  createProxyMiddleware,
  fixRequestBody,
  responseInterceptor,
} = require("http-proxy-middleware");
const next = require("next");
const { generateRequestId, generateTransactionId } = require("./server/utils");
const logger = require("./server/logger");

loadEnvConfig("./", process.env.NODE_ENV !== "production");
const ENV = process.env;
const PORT = ENV.NEXT_PUBLIC_APP_PORT || 3000;
const isLocal = ENV.NEXT_PUBLIC_ENV === "local";
const app = next({
  dev: process.env.NODE_ENV !== "production",
  port: isLocal ? PORT : 443,
  hostname: ENV.NEXT_PUBLIC_HOSTNAME,
});

const handle = app.getRequestHandler();
const PATH_PREFIX = ENV.NEXT_PUBLIC_PREFIX || "";

const rewriteFn = function (path) {
  return path.replace(`${PATH_PREFIX}/api`, "/api");
};

(async () => {
  await app.prepare();
  const server = express();
  server.disable("x-powered-by");
  server.use(cors({ origin: ENV.ALLOW_ORIGIN }));
  server.use(
    express.json({ limit: "10mb" }),
    express.urlencoded({ extended: true, limit: "10mb" }),
    createProxyMiddleware(`${PATH_PREFIX}/api`, {
      target: ENV.NEXT_PUBLIC_BASE_API,
      pathRewrite: rewriteFn,
      secure: false,
      changeOrigin: true,
      selfHandleResponse: true,
      cookieDomainRewrite: "localhost",
      onProxyReq: (proxyReq, req, res) => {
        req.startTime = new Date();
        req.requestId =
          req.headers["x-api-request-id"] ||
          req.headers["x-acim-req-id"] ||
          generateRequestId();
        req.transactionId =
          req.headers["x-transaction-id"] || generateTransactionId();
        proxyReq.setHeader("x-api-request-id", req.requestId);
        proxyReq.setHeader("x-transaction-id", req.transactionId);
        return fixRequestBody(proxyReq, req);
      },
      onProxyRes: responseInterceptor((responseBuffer, proxyRes, req, res) => {
        const response = responseBuffer.toString("utf8");
        const headers = res.getHeaders();
        const attachment = headers["content-disposition"];
        res.rawResponseBody = attachment ? attachment : response;
        logger.access(req, res);
        return responseBuffer;
      }),
      onError: (err) => {
        console.log("err", err);
      },
    })
  );

  server.get(`${PATH_PREFIX}/health`, (req, res) => res.json({ status: "UP" }));

  server.use((req, res) => {
    handle(req, res);
  });

  if (ENV.USE_HTTPS === "true") {
    //run https
    const privateKey = fs.readFileSync(ENV.SSL_KEY, "utf8").toString();
    const certificate = fs.readFileSync(ENV.SSL_CERT, "utf8").toString();
    const credentials = {
      key: privateKey,
      cert: certificate,
      ciphers:
        "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSAAES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-A",
      honorCipherOrder: true,
      minVersion: "TLSv1.2",
      maxVersion: "TLSv1.2",
    };
    if (ENV.SSL_CA && fs.existsSync(ENV.SSL_CA)) {
      const certificateAuthority = fs
        .readFileSync(ENV.SSL_CA, "utf8")
        .toString();
      credentials.ca = certificateAuthority;
    }

    https
      .createServer(credentials, server)
      .listen(PORT, () =>
        console.log(
          `App (https) listening on port ${PORT} ENV: ${ENV.NEXT_PUBLIC_ENV}`
        )
      );
  } else {
    //run http
    server.listen(PORT, () =>
      console.log(
        `App (http) listening on port ${PORT} ENV: ${ENV.NEXT_PUBLIC_ENV}`
      )
    );
  }
})();
