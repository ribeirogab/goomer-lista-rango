import { inject, injectable } from 'tsyringe';

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

    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
  ) {}

  public async execute({
    page = 1,
    perPage = 10,
  }: IRequest): Promise<IResponse> {
    const { count, restaurants } = await this.restaurantsRepository.findAll({
      page,
      perPage,
    });

    const pageInfo = this.paginationProvider.getPageInfo({
      currentPage: page,
      perPage,
      total: count,
    });

    return { pageInfo, restaurants };
  }
}
