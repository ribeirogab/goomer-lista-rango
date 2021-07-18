import 'reflect-metadata';

import { FakePaginationProvider } from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import { FakeAddressesRepository } from '@modules/addresses/repositories/fakes/FakeAddressesRepository';
import { FakeRestaurantAddressesRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantAddressesRepository';
import { FakeRestaurantsRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import { FakeWorkSchedulesRepository } from '@modules/restaurants/repositories/fakes/FakeWorkSchedulesRepository';
import { ListAllRestaurantsService } from '@modules/restaurants/services/ListAllRestaurantsService';

let fakePaginationProvider: FakePaginationProvider;
let fakeAddressesRepository: FakeAddressesRepository;
let fakeRestaurantAddressesRepository: FakeRestaurantAddressesRepository;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let fakeWorkSchedulesRepository: FakeWorkSchedulesRepository;
let listAllRestaurantsService: ListAllRestaurantsService;

describe('ListAllRestaurantsService', () => {
  beforeEach(() => {
    fakeAddressesRepository = new FakeAddressesRepository();
    fakeWorkSchedulesRepository = new FakeWorkSchedulesRepository();
    fakeRestaurantAddressesRepository = new FakeRestaurantAddressesRepository(
      fakeAddressesRepository,
    );
    fakeRestaurantsRepository = new FakeRestaurantsRepository(
      fakeWorkSchedulesRepository,
      fakeRestaurantAddressesRepository,
    );
    fakePaginationProvider = new FakePaginationProvider();

    listAllRestaurantsService = new ListAllRestaurantsService(
      fakeRestaurantsRepository,
      fakePaginationProvider,
    );
  });

  it('should be able to list all restaurants', async () => {
    const restaurantName = 'Goomer Restaurant';

    await fakeRestaurantsRepository.create({ name: restaurantName });

    const { restaurants } = await listAllRestaurantsService.execute({});

    expect(restaurants.length).toBe(1);
    expect(restaurants[0].name).toBe(restaurantName);
  });
});
