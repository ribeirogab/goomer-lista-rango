import { inject, injectable } from 'tsyringe';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import {
  IPaginationProvider,
  PageInfo,
} from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import { IRestaurant } from '../models/IRestaurant';
import { IRestaurantsRepository } from '../repositories/IRestaurantsRepository';

interface IRequest {
  page?: number;
  perPage?: number;
}

interface IResponse {
  pageInfo: PageInfo;
  restaurants: IRestaurant[];
}

@injectable()
export class ListAllRestaurantsService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
  ) {}

  public async execute({
    page = 1,
    perPage = 10,
  }: IRequest): Promise<IResponse> {
    const cacheKey = this.cacheProvider.createKey({
      prefix: 'restaurant-list',
      params: [page, perPage],
    });

    const cacheData = await this.cacheProvider.recover<IResponse>(cacheKey);

    if (cacheData) {
      return cacheData;
    }

    const { count, restaurants } = await this.restaurantsRepository.findAll({
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
      restaurants,
    });

    return { pageInfo, restaurants };
  }
}
