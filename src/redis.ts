import { Logger } from "@nestjs/common";
import * as IORedis from "ioredis";
import { CONFIG } from "./config";

export const redis = new IORedis(CONFIG.REDIS_URL);

redis.on("connect", () => Logger.log("redis connected"));
redis.on("error", (error) =>
  console.log("redis error: ", error.message || error)
);

export const getCacheKeys = () => {
  const keys = redis.keys("*");
};
