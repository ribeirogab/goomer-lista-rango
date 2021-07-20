import { container } from 'tsyringe';

import { uploadConfig } from '@config/upload';

import { AmazonS3Provider } from './implementations/AmazonS3Provider';
import { DiskStorageProvider } from './implementations/DiskStorageProvider';
import { IStorageProvider } from './models/IStorageProvider';

const storageProviders = {
  disk: DiskStorageProvider,
  s3: AmazonS3Provider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  storageProviders[uploadConfig.driver],
);
