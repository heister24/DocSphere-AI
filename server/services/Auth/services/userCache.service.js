import redis from "../configs/redis.js";

const USERCACHE_PREFIX = "auth:user:";

export const getUserKey = (userId) => {
  return `${USERCACHE_PREFIX}${userId}`;
};

export const cacheUser = async (user) => {
  const key = getUserKey(user._id.toString());

  const userData = {
    _id: user._id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
  };

  await redis.set(
    key,
    JSON.stringify(userData),
    "EX",
    Number(process.env.USER_CACHE_EXPIRY),
  );
};

export const getCachedUser = async (userId) => {
  const key = getUserKey(userId);

  const user = await redis.get(key);
  if (!user) {
    return null;
  }

  return JSON.parse(user);
};

export const deleteCachedUser = async (userId) => {
  const key = getUserKey(userId);
  await redis.del(key);
};
