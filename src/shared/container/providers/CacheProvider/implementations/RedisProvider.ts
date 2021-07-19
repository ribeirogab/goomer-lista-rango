/* eslint-disable no-console */
import Redis, { Redis as RedisClient } from 'ioredis';

import { cacheConfig } from '@config/cache';

import { ICreateKeyDTO } from '../dtos/ICreateKeyDTO';
import { ICacheProvider } from '../models/ICacheProvider';

export class RedisProvider implements ICacheProvider {
  private client: RedisClient;
  private isReadyToUse: boolean;

  constructor() {
    this.client = new Redis({
      ...cacheConfig.config.redis,
    });

    this.client.on('error', () => {
      this.client.disconnect();
    });
  }

  public async save(key: string, value: unknown): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value));
    } catch (error) {
      console.log(
        `[RedisProvider] save - Error saving cache.\nError: ${error}\n`,
      );
    }
  }

  public async recover<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);

      if (!data) {
        return null;
      }

      const parsedData = JSON.parse(data) as T;

      return parsedData;
    } catch (error) {
      console.log(
        `[RedisProvider] recover - Error to recover cache.\nError: ${error}\n`,
      );
      return null;
    }
  }

  public async invalidate(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.log(
        `[RedisProvider] invalidate - Error to try invalidate cache.\nError: ${error}\n`,
      );
    }
  }

  public async invalidatePrefix(
    prefix: string,
    fullPattern?: string,
  ): Promise<void> {
    try {
      const keys = await this.client.keys(fullPattern || `${prefix}:*`);

      const pipeline = this.client.pipeline();

      keys.forEach(key => {
        pipeline.del(key);
      });

      await pipeline.exec();
    } catch (error) {
      console.log(
        `[RedisProvider] invalidatePrefix - Error to try invalidate cache.\nError: ${error}\n`,
      );
    }
  }

  public createKey({ prefix, params = [], identifier }: ICreateKeyDTO): string {
    const filteredParams = params.filter(param => param);

    const key = `${prefix}${
      filteredParams.length > 0 ? `:${filteredParams.join(',')}` : ''
    }${identifier ? `:${identifier}` : ''}`;

    return key;
  }
}
