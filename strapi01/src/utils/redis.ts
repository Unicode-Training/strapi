import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
export const storeRefreshToken = async (
  jti: string,
  userId: number,
  exp: number
) => {
  const ttl = exp - Math.floor(Date.now() / 1000);
  await redis.set(`refreshToken:${jti}`, userId.toString(), "EX", ttl);
};

export const revokeRefreshToken = async (jti: string) => {
  await redis.del(`refreshToken:${jti}`);
};

export const isRefreshTokenValid = async (jti: string) => {
  const res = await redis.get(`refreshToken:${jti}`);
  return res !== null;
};

export const storeBlacklist = async (
  jti: string,
  userId: number,
  exp: number
) => {
  const ttl = exp - Math.floor(Date.now() / 1000);
  await redis.set(`blacklist:${jti}`, userId.toString(), "EX", ttl);
};

export const isTokenBlacklist = async (jti: string) => {
  const res = await redis.get(`blacklist:${jti}`);
  return res !== null;
};

export default redis;
