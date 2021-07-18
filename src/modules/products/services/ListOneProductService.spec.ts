import 'reflect-metadata';

import { AppError } from '@shared/errors/AppError';

import { FakeCategoriesRepository } from '@modules/products/repositories/fakes/FakeCategoriesRepository';
import { FakeProductsRepository } from '@modules/products/repositories/fakes/FakeProductsRepository';
import { FakePromotionsRepository } from '@modules/products/repositories/fakes/FakePromotionsRepository';
import { ListOneProductService } from '@modules/products/services/ListOneProductService';

let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakePromotionsRepository: FakePromotionsRepository;

let listOneProductService: ListOneProductService;

describe('ListOneProductService', () => {
  beforeEach(() => {
    fakePromotionsRepository = new FakePromotionsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeProductsRepository = new FakeProductsRepository(
      fakePromotionsRepository,
      fakeCategoriesRepository,
    );

    listOneProductService = new ListOneProductService(fakeProductsRepository);
  });

  it('should be able to list one product of restaurant by id', async () => {
    const restaurantId = 'any-id-for-test';

    const restaurantProduct = await fakeProductsRepository.create({
      restaurantId,
      categoryId: 'any-id',
      name: 'X-bacon',
      price: 18,
    });

    await fakeProductsRepository.create({
      restaurantId: 'other-any-id',
      categoryId: 'any-id',
      name: 'X-salada',
      price: 15,
    });

    const product = await listOneProductService.execute({
      restaurantId,
      productId: restaurantProduct.id,
    });

    expect(product.name).toBe('X-bacon');
    expect(product.price).toBe(18);
  });

  it("should not be able to list product if it doesn't exist", async () => {
    await expect(
      listOneProductService.execute({
        restaurantId: 'any-id',
        productId: 'any-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
