import { ICreateKeyDTO } from '../dtos/ICreateKeyDTO';

export interface ICacheProvider {
  save(key: string, value: unknown): Promise<void>;

  recover<T>(key: string): Promise<T | null>;

  invalidate(key: string): Promise<void>;

  invalidatePrefix(prefix: string): Promise<void>;

  createKey({ prefix, params, identifier }: ICreateKeyDTO): string;
}
