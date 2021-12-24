import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from 'cache-manager';
import { AnyObject } from "mongoose";


@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async get(key: string) {
    const data = await this.cacheManager.get(key);
    return data;
  }

  async set(key: string, value: AnyObject, ttl = 0) {
    console.log(key, value);
    const itemIsSet = await this.cacheManager.set(key, value, { ttl })
    console.log('new cache entry', key, itemIsSet)
  }

  async clear() {
    await this.cacheManager.reset();
  }

  async del(key: string) {
    await this.cacheManager.del(key);
  }

  async logCacheKeys() {
    const keys = await this.cacheManager.store.keys() as string[];
    console.log(keys);
  }
}