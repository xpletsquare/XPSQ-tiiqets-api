import { Injectable, Logger } from "@nestjs/common";
import { getCacheKeys, redis } from "src/redis";


@Injectable()
export class CacheService {
  constructor(
    // @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  readonly redis = redis;
  readonly ONE_HOUR = 60 * 60;
  readonly TWENTY_FOUR_HOURS = 60 * 60 * 24
  readonly logger = new Logger()

  async get(key: string) {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl = this.TWENTY_FOUR_HOURS) {
    const valueAsstring = JSON.stringify(value);
    const itemIsSet = await this.redis.set(key, valueAsstring, 'ex', ttl)
    const log = ['new cache entry', key, itemIsSet].join('-');
    this.logger.log(log);
  }

  async clear() {
    await this.redis
  }

  async del(key: string) {
    await this.redis.del(key);
  }

  async logCacheKeys() {
    getCacheKeys()
  }
}