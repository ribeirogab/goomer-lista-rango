import 'reflect-metadata';

import { AppError } from '@shared/errors/AppError';

import { FakeStorageProvider } from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import { FakeAddressesRepository } from '@modules/addresses/repositories/fakes/FakeAddressesRepository';
import { FakeRestaurantsRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';

import { FakeRestaurantAddressesRepository } from '../repositories/fakes/FakeRestaurantAddressesRepository';
import { FakeWorkSchedulesRepository } from '../repositories/fakes/FakeWorkSchedulesRepository';
import { UpdateRestaurantImage } from './UpdateRestaurantImage';

let fakeStorageProvider: FakeStorageProvider;
let fakeAddressesRepository: FakeAddressesRepository;
let fakeRestaurantAddressesRepository: FakeRestaurantAddressesRepository;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let fakeWorkSchedulesRepository: FakeWorkSchedulesRepository;
let updateRestaurantImage: UpdateRestaurantImage;

describe('UpdateRestaurantImage', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeAddressesRepository = new FakeAddressesRepository();
    fakeWorkSchedulesRepository = new FakeWorkSchedulesRepository();
    fakeRestaurantAddressesRepository = new FakeRestaurantAddressesRepository(
      fakeAddressesRepository,
    );
    fakeRestaurantsRepository = new FakeRestaurantsRepository(
      fakeWorkSchedulesRepository,
      fakeRestaurantAddressesRepository,
    );

    updateRestaurantImage = new UpdateRestaurantImage(
      fakeRestaurantsRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update restaurant image', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Lista Rango',
    });

    const updatedRestaurant = await updateRestaurantImage.execute({
      restaurantId: restaurant.id,
      imageFilename: 'example.jpg',
    });

    expect(updatedRestaurant.id).toBe(restaurant.id);
    expect(updatedRestaurant.image).toBe('example.jpg');
  });

  it('should delete old image when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Lista Rango',
    });

    await updateRestaurantImage.execute({
      restaurantId: restaurant.id,
      imageFilename: 'example.jpg',
    });

    await updateRestaurantImage.execute({
      restaurantId: restaurant.id,
      imageFilename: 'example-2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('example.jpg');
  });

  it('should not be able to update image from non existing restaurant (or wrong id)', async () => {
    await expect(
      updateRestaurantImage.execute({
        restaurantId: 'any-id',
        imageFilename: 'example.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update image without imageFilename param', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Lista Rango',
    });

    await expect(
      updateRestaurantImage.execute({
        restaurantId: restaurant.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
