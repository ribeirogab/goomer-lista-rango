import 'reflect-metadata';

import { AppError } from '@shared/errors/AppError';

import { FakeAddressProvider } from '@shared/container/providers/AddressProvider/fakes/FakeAddressProvider';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { FakeDateProvider } from '@shared/container/providers/DateProvider/fakes/FakeDateProvider';

import { FakeAddressesRepository } from '@modules/addresses/repositories/fakes/FakeAddressesRepository';
import { FakeRestaurantAddressesRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantAddressesRepository';
import { FakeRestaurantsRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import { FakeWorkSchedulesRepository } from '@modules/restaurants/repositories/fakes/FakeWorkSchedulesRepository';
import { UpdateRestaurantService } from '@modules/restaurants/services/UpdateRestaurantService';

let fakeAddressProvider: FakeAddressProvider;
let fakeCacheProvider: FakeCacheProvider;
let fakeDateProvider: FakeDateProvider;

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
    fakeDateProvider = new FakeDateProvider();

    updateRestaurantService = new UpdateRestaurantService(
      fakeRestaurantsRepository,
      fakeAddressesRepository,
      fakeRestaurantAddressesRepository,
      fakeWorkSchedulesRepository,
      fakeAddressProvider,
      fakeCacheProvider,
      fakeDateProvider,
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

  it('should not be able to update restaurant with invalid work schedules (end time must be later than start time)', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Coffee',
    });

    await expect(
      updateRestaurantService.execute({
        restaurantId: restaurant.id,
        workSchedules: {
          monday: {
            startHour: '10:00', // start time greater than finish time
            finishHour: '09:00',
          },
        },
      }),
    ).rejects.toEqual(
      new AppError(
        'End time must be later than start time in the field "monday.startHour"',
        400,
      ),
    );
  });

  it('should not be able to update restaurant with invalid work schedules (the intervals between times must be at least 15 minutes)', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Coffee',
    });

    await expect(
      updateRestaurantService.execute({
        restaurantId: restaurant.id,
        workSchedules: {
          monday: {
            startHour: '09:45', // interval between startHour and finishHour less than 15 minutes
            finishHour: '09:59',
          },
        },
      }),
    ).rejects.toEqual(
      new AppError(
        'The intervals between times must be at least 15 minutes in the field "monday.startHour"',
        400,
      ),
    );
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
