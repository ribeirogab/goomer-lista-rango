import { Router } from 'express';

import { restaurantsRouter } from '@modules/restaurants/infra/http/routes/restaurants.routes';

const routes = Router();

routes.use('/restaurants', restaurantsRouter);

export { routes };
