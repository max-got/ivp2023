import express from 'express';
const rooms_routes = express.Router();

import * as rooms_controller from './rooms.controller';
import { zodMiddlewareValidator } from 'src/middlewares/zod';
import { idParamSchema, roomTypeParamSchema, dateQuerySchema } from './rooms.zod';

// Get all rooms
rooms_routes.get('/', zodMiddlewareValidator({ query: dateQuerySchema }), (req, res, next) =>
	rooms_controller.get_all_rooms(req, res, next)
);

// Get room by id
rooms_routes.get(
	'/:id',
	zodMiddlewareValidator({ query: dateQuerySchema, params: idParamSchema }),
	(req, res, next) => rooms_controller.get_room_by_id(req, res, next)
);

// Get Rooms by Hotel id
rooms_routes.get(
	'/hotel/:id',
	zodMiddlewareValidator({ query: dateQuerySchema, params: idParamSchema }),
	(req, res, next) => rooms_controller.get_rooms_by_hotel_id(req, res, next)
);
// Get Rooms by Hotel id
rooms_routes.get(
	'/hotel/id/:id',
	zodMiddlewareValidator({ query: dateQuerySchema, params: idParamSchema }),
	(req, res, next) => rooms_controller.get_rooms_by_hotel_id(req, res, next)
);

// Get Rooms by Hotel name
rooms_routes.get(
	'/hotel/name/:name',
	zodMiddlewareValidator({ query: dateQuerySchema }),
	(req, res, next) => rooms_controller.get_rooms_by_hotel_name(req, res, next)
);
// Get Rooms by City id
rooms_routes.get(
	'/city/:id',
	zodMiddlewareValidator({ query: dateQuerySchema, params: idParamSchema }),
	(req, res, next) => rooms_controller.get_rooms_by_city_id(req, res, next)
);

// Get Rooms by City id
rooms_routes.get(
	'/city/id/:id',
	zodMiddlewareValidator({ query: dateQuerySchema, params: idParamSchema }),
	(req, res, next) => rooms_controller.get_rooms_by_city_id(req, res, next)
);

// Get Rooms by City name
rooms_routes.get(
	'/city/name/:name',
	zodMiddlewareValidator({ query: dateQuerySchema }),
	(req, res, next) => rooms_controller.get_rooms_by_city_name(req, res, next)
);

// Get Rooms by City id and Hotel id
rooms_routes.get(
	'/city/id/:city/hotel/id/:hotel',
	zodMiddlewareValidator({ query: dateQuerySchema }),
	(req, res, next) => rooms_controller.get_rooms_by_city_id_and_hotel_id(req, res, next)
);

// Get Rooms by City name and Hotel name
rooms_routes.get(
	'/city/:city/hotel/:hotel',
	zodMiddlewareValidator({ query: dateQuerySchema }),
	(req, res, next) => rooms_controller.get_rooms_by_city_name_and_hotel_name(req, res, next)
);

// Get Rooms by Room type
rooms_routes.get(
	'/roomType/:roomType',
	zodMiddlewareValidator({
		query: dateQuerySchema,
		params: roomTypeParamSchema
	}),
	(req, res, next) => rooms_controller.get_rooms_by_roomType(req, res, next)
);

export default rooms_routes;
