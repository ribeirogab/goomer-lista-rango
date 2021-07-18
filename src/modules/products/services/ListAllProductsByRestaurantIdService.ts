import { inject, injectable } from 'tsyringe';

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

    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
  ) {}

  public async execute({
    restaurantId,
    page = 1,
    perPage = 10,
  }: IRequest): Promise<IResponse> {
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

    return { pageInfo, products };
  }
}
