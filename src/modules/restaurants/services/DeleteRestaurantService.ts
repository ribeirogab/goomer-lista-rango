import { inject, injectable } from 'tsyringe';

import { IRestaurantsRepository } from '../repositories/IRestaurantsRepository';

interface IRequest {
  restaurantId: string;
}

@injectable()
export class DeleteRestaurantService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,
  ) {}

  public async execute({ restaurantId }: IRequest): Promise<void> {
    await this.restaurantsRepository.deleteById(restaurantId);
  }
}
