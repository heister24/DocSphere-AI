import redis from "../../services/Auth/configs/redis.js";

export const documentRateLimiter = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const key = `rate-limit:document:${userId}`;

    const limit = Number(
      process.env.DOCUMENT_RATE_LIMIT || 15
    );

    const windowSeconds = Number(
      process.env.DOCUMENT_RATE_WINDOW || 60
    );

    const requestCount = await redis.incr(key);

    if (requestCount === 1) {
      await redis.expire(
        key,
        windowSeconds
      );
    }

    if (requestCount > limit) {
      return res.status(429).json({
        success: false,
        message:
          "Too many requests. Please try again later.",
      });
    }

    res.setHeader(
      "X-RateLimit-Limit",
      limit
    );

    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(
        0,
        limit - requestCount
      )
    );

    next();
  } catch (error) {
    console.error(
      "Document rate limiter error:",
      error
    );

    // If Redis is temporarily unavailable,
    // allow the request instead of breaking the API.
    next();
  }
};