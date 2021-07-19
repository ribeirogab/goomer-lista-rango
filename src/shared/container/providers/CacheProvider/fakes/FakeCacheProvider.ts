import { ICreateKeyDTO } from '../dtos/ICreateKeyDTO';
import { ICacheProvider } from '../models/ICacheProvider';

interface ICacheData {
  [key: string]: string;
}

export class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save(key: string, value: unknown): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key];

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async invalidatePrefix(
    prefix: string,
    _fullPattern?: string,
  ): Promise<void> {
    const keys = Object.keys(this.cache).filter(key => key.startsWith(prefix));

    keys.forEach(key => {
      delete this.cache[key];
    });
  }

  public createKey({ prefix, params = [], identifier }: ICreateKeyDTO): string {
    const filteredParams = params.filter(param => param);

    const key = `${prefix}${
      filteredParams.length > 0 ? `:${filteredParams.join(',')}` : ''
    }${identifier ? `:${identifier}` : ''}`;

    return key;
  }
}
