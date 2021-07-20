import { NextFunction, Request, Response } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import { AppError } from '@shared/errors/AppError';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
  connectTimeout: 4000,
  maxRetriesPerRequest: 0,
});

let limiter: RateLimiterRedis | null;

redisClient.on('error', () => {
  redisClient.disconnect();
});

redisClient.on('connect', () => {
  limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimiter',
    points: 5,
    duration: 1,
  });
});

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!limiter) {
      return next();
    }

    await limiter.consume(req.ip);

    return next();
  } catch (error) {
    throw new AppError('Too many requests.', 429);
  }
}
