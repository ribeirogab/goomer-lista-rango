import { inject, injectable } from 'tsyringe';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import {
  IPaginationProvider,
  PageInfo,
} from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import { IProduct } from '../models/IProduct';
import { IProductsRepository } from '../repositories/IProductsRepository';

interface IRequest {
  restaurantId: string;
  page?: number;
  perPage?: number;
}

interface IResponse {
  pageInfo: PageInfo;
  products: IProduct[];
}

@injectable()
export class ListAllProductsByRestaurantIdService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
  ) {}

  public async execute({
    restaurantId,
    page = 1,
    perPage = 10,
  }: IRequest): Promise<IResponse> {
    const cacheKey = this.cacheProvider.createKey({
      prefix: 'product-list',
      params: [restaurantId, page, perPage],
    });

    const cacheData = await this.cacheProvider.recover<IResponse>(cacheKey);

    if (cacheData) {
      return cacheData;
    }

    const { count, products } = await this.productsRepository.findAll({
      restaurantId,
      page,
      perPage,
    });

    const pageInfo = this.paginationProvider.getPageInfo({
      currentPage: page,
      perPage,
      total: count,
    });

    await this.cacheProvider.save(cacheKey, {
      pageInfo,
      products,
    });

    return { pageInfo, products };
  }
}
