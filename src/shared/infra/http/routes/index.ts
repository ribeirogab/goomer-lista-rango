import { Router } from 'express';

import { productImageRouter } from '@modules/products/infra/http/routes/image.routes';
import { productsRouter } from '@modules/products/infra/http/routes/products.routes';
import { restaurantImageRouter } from '@modules/restaurants/infra/http/routes/image.routes';
import { restaurantsRouter } from '@modules/restaurants/infra/http/routes/restaurants.routes';

const routes = Router();

routes.use('/restaurants', restaurantsRouter);
routes.use('/restaurants/image', restaurantImageRouter);

routes.use('/products', productsRouter);
routes.use('/products/image', productImageRouter);

export { routes };
