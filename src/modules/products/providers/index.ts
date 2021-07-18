import { container } from 'tsyringe';

import { CategoriesRepository } from '@modules/products/infra/postgreSQL/repositories/CategoriesRepository';
import { ProductsRepository } from '@modules/products/infra/postgreSQL/repositories/ProductsRepository';
import { PromotionsRepository } from '@modules/products/infra/postgreSQL/repositories/PromotionsRepository';
import { ICategoriesRepository } from '@modules/products/repositories/ICategoriesRepository';
import { IProductsRepository } from '@modules/products/repositories/IProductsRepository';
import { IPromotionsRepository } from '@modules/products/repositories/IPromotionsRepository';

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository,
);

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository,
);

container.registerSingleton<IPromotionsRepository>(
  'PromotionsRepository',
  PromotionsRepository,
);
