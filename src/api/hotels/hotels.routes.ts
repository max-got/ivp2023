import express from 'express';
const hotels_routes = express.Router();

import * as hotels_controller from './hotels.controller';
import { zodMiddlewareValidator } from 'src/middlewares/zod';
import { idParamSchema } from './hotels.zod';

// Get all Hotels
hotels_routes.get('/', (req, res, next) => hotels_controller.get_all_hotels(req, res, next));

// Get Hotel by id
hotels_routes.get(
	'/:id',
	zodMiddlewareValidator({ paramsSchema: idParamSchema }),
	(req, res, next) => hotels_controller.get_hotel_by_id(req, res, next)
);

// Get Hotel by Name
hotels_routes.get('/name/:name', (req, res, next) =>
	hotels_controller.get_hotel_by_name(req, res, next)
);

// Get Hotel by city
hotels_routes.get('/city/:city', (req, res, next) =>
	hotels_controller.get_hotel_by_city(req, res, next)
);

// Get Hotel by city and hotel
hotels_routes.get(
	'/city/:city/hotel/id/:id',
	zodMiddlewareValidator({ paramsSchema: idParamSchema }),
	(req, res, next) => hotels_controller.get_hotel_by_city_and_id(req, res, next)
);

// Get Hotel by city and name
hotels_routes.get('/city/:city/hotel/name/:name', (req, res, next) =>
	hotels_controller.get_hotel_by_city_and_name(req, res, next)
);

export default hotels_routes;
