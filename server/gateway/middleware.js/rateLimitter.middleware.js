import redis from "../../services/Auth/configs/redis.js";

export const rateLimit = ({
  limit = 10,
  windowSeconds = 60,
  keyPrefix = "gateway:rate-limit",
}) => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id.toString();

      const identifier = userId || req.ip;

      const key = `${key}:${identifier}`;

      const currentCount = await redis.incr(key);

      if (currentCount === 1) {
        await redis.expire(key, windowSeconds);
      }

      if (currentCount > limit) {
        return res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
        });
      } // Optional rate-limit information for the client
      res.setHeader("X-RateLimit-Limit", limit);

      res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - currentCount));

      next();
    } catch (error) {
      console.error("Rate limiter error:", error);

      // Don't take the entire API down if Redis
      // temporarily becomes unavailable.
      next();
    }
  };
};
