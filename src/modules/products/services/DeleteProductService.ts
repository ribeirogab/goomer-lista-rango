import { inject, injectable } from 'tsyringe';

import { IProductsRepository } from '../repositories/IProductsRepository';

interface IRequest {
  restaurantId: string;
  productId: string;
}

@injectable()
export class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ restaurantId, productId }: IRequest): Promise<void> {
    await this.productsRepository.delete({ restaurantId, productId });
  }
}
