import Redis, { Redis as RedisClient } from 'ioredis';

import { cacheConfig } from '@config/cache';

import { ICreateKeyDTO } from '../dtos/ICreateKeyDTO';
import { ICacheProvider } from '../models/ICacheProvider';

export class RedisProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: unknown): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(
    prefix: string,
    fullPattern?: string,
  ): Promise<void> {
    const keys = await this.client.keys(fullPattern || `${prefix}:*`);

    const pipeline = this.client.pipeline();

    keys.forEach(key => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }

  public createKey({ prefix, params = [], identifier }: ICreateKeyDTO): string {
    const filteredParams = params.filter(param => param);

    const key = `${prefix}${
      filteredParams.length > 0 ? `:${filteredParams.join(',')}` : ''
    }${identifier ? `:${identifier}` : ''}`;

    return key;
  }
}
