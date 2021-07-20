import 'reflect-metadata';

import { AppError } from '@shared/errors/AppError';

import { FakeAddressProvider } from '@shared/container/providers/AddressProvider/fakes/FakeAddressProvider';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import { FakeAddressesRepository } from '@modules/addresses/repositories/fakes/FakeAddressesRepository';
import { FakeRestaurantAddressesRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantAddressesRepository';
import { FakeRestaurantsRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import { FakeWorkSchedulesRepository } from '@modules/restaurants/repositories/fakes/FakeWorkSchedulesRepository';
import { UpdateRestaurantService } from '@modules/restaurants/services/UpdateRestaurantService';

let fakeAddressProvider: FakeAddressProvider;
let fakeCacheProvider: FakeCacheProvider;

let fakeAddressesRepository: FakeAddressesRepository;
let fakeRestaurantAddressesRepository: FakeRestaurantAddressesRepository;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let fakeWorkSchedulesRepository: FakeWorkSchedulesRepository;

let updateRestaurantService: UpdateRestaurantService;

describe('UpdateRestaurantService', () => {
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
    fakeAddressProvider = new FakeAddressProvider();
    fakeCacheProvider = new FakeCacheProvider();

    updateRestaurantService = new UpdateRestaurantService(
      fakeRestaurantsRepository,
      fakeAddressesRepository,
      fakeRestaurantAddressesRepository,
      fakeWorkSchedulesRepository,
      fakeAddressProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to update the restaurant name', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Restaurant',
    });

    const newName = 'Goomer Lista Rango';

    const restaurantUpdated = await updateRestaurantService.execute({
      restaurantId: restaurant.id,
      name: newName,
    });

    expect(restaurantUpdated.id).toBe(restaurant.id);
    expect(restaurantUpdated.name).toBe(newName);
  });

  it('should be able to update the restaurant addresses', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Restaurant',
    });

    const newAddresses = [
      {
        postalCode: '18046-805',
        number: '460',
      },
    ];

    const restaurantUpdated = await updateRestaurantService.execute({
      restaurantId: restaurant.id,
      addresses: newAddresses,
    });

    expect(restaurantUpdated.id).toBe(restaurant.id);
    expect(restaurantUpdated.addresses.length).toBe(1);
    expect(restaurantUpdated.addresses[0].postalCode).toBe(
      newAddresses[0].postalCode,
    );
    expect(restaurantUpdated.addresses[0].number).toBe(newAddresses[0].number);
  });

  it('should be able to update restaurant schedules', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Coffee',
    });

    const newWorkSchedules = {
      monday: {
        startHour: '06:00',
        finishHour: '10:00',
      },
    };

    const restaurantUpdated = await updateRestaurantService.execute({
      restaurantId: restaurant.id,
      workSchedules: newWorkSchedules,
    });

    expect(restaurantUpdated.id).toBe(restaurant.id);
    expect(restaurantUpdated.workSchedules).toHaveProperty('sunday');
    expect(restaurantUpdated.workSchedules).toHaveProperty('monday');
    expect(restaurantUpdated.workSchedules).toHaveProperty('tuesday');
    expect(restaurantUpdated.workSchedules).toHaveProperty('wednesday');
    expect(restaurantUpdated.workSchedules).toHaveProperty('thursday');
    expect(restaurantUpdated.workSchedules).toHaveProperty('friday');
    expect(restaurantUpdated.workSchedules).toHaveProperty('saturday');
    expect(restaurantUpdated.workSchedules?.monday).toStrictEqual({
      startHour: '06:00',
      finishHour: '10:00',
    });
  });

  it("should not be able to update restaurant if it doesn't exist", async () => {
    await expect(
      updateRestaurantService.execute({
        restaurantId: 'any-id',
        name: 'New name',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
