import { inject, injectable } from 'tsyringe';

import { IRestaurant } from '../models/IRestaurant';
import { IRestaurantsRepository } from '../repositories/IRestaurantsRepository';

interface IRequest {
  page?: number;
  perPage?: number;
}

interface IResponse {
  restaurants: IRestaurant[];
  count: number;
}

@injectable()
export class ListAllRestaurantsService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,
  ) {}

  public async execute({
    page = 1,
    perPage = 10,
  }: IRequest): Promise<IResponse> {
    const { count, restaurants } = await this.restaurantsRepository.findAll({
      page,
      perPage,
    });

    return { count, restaurants };
  }
}
