import express from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import authGateway from "../middleware.js/authGateway.js";
import { documentRateLimiter } from "../middleware.js/documentRateLimit.js";

const documentRouteProxy = express.Router();

documentRouteProxy.use(
  "/",
  authGateway,
  documentRateLimiter,
  createProxyMiddleware({
    target: process.env.DOCUMENT_URL,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        if (req.userId) {
          proxyReq.setHeader("x-user-id", req.userId);
          // set header in lowercase or capitalcase no matters becuse when we retrive them
          // using req.headers["header name"] they are converted into lowercase.
        }
        fixRequestBody(proxyReq, req);
      },
    },
  }),
);

export default documentRouteProxy;
