import 'reflect-metadata';

import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import { FakeCategoriesRepository } from '@modules/products/repositories/fakes/FakeCategoriesRepository';
import { FakeProductsRepository } from '@modules/products/repositories/fakes/FakeProductsRepository';
import { FakePromotionsRepository } from '@modules/products/repositories/fakes/FakePromotionsRepository';
import { DeleteProductService } from '@modules/products/services/DeleteProductService';

let fakeCacheProvider: FakeCacheProvider;

let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakePromotionsRepository: FakePromotionsRepository;
let deleteProductService: DeleteProductService;

describe('DeleteProductService', () => {
  beforeEach(() => {
    fakePromotionsRepository = new FakePromotionsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeProductsRepository = new FakeProductsRepository(
      fakePromotionsRepository,
      fakeCategoriesRepository,
    );
    fakeCacheProvider = new FakeCacheProvider();

    deleteProductService = new DeleteProductService(
      fakeProductsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete product', async () => {
    const restaurantId = 'any-id-for-test';

    const product = await fakeProductsRepository.create({
      restaurantId,
      categoryId: 'any-id',
      name: 'Pizza',
      price: 39.9,
    });

    await expect(
      deleteProductService.execute({
        restaurantId,
        productId: product.id,
      }),
    ).resolves.not.toThrow();
  });
});
