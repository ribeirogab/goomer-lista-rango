import { Router } from 'express';

import { productsRouter } from '@modules/products/infra/http/routes/products.routes';
import { restaurantsRouter } from '@modules/restaurants/infra/http/routes/restaurants.routes';

const routes = Router();

routes.use('/restaurants', restaurantsRouter);
routes.use('/products', productsRouter);

export { routes };
