import express from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

const authRouteProxy = express.Router();

authRouteProxy.use(
  "/",
  createProxyMiddleware({
    target: `${process.env.AUTH_URL}`,
    changeOrigin: true,
    on: {
      proxyReq: fixRequestBody,
      error: (err, req, res) => {
        console.error("Auth proxy error:", err.message);
        if (!res.headersSent) {
          res.status(502).json({
            success: false,
            message: "Auth service is currently unavailable",
          });
        }
      },
    },
  }),
);

export default authRouteProxy;
