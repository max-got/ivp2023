import express from 'express';
const bookings_routes = express.Router();

import * as bookings_controller from './bookings.controller';
import { zodMiddlewareValidator } from 'src/middlewares/zod';
import {
	idParamSchema,
	dateQuerySchemaRequired,
	check_multiple_rooms_by_ids_query_schema,
	check_multiple_rooms_by_roomType_query_schema,
	roomTypeSchema,
	check_multiple_rooms_by_cityId_query_schema
} from './bookings.zod';
import z from 'zod';

// Check if single Room by ID is available
bookings_routes.get(
	'/rooms/:id',
	zodMiddlewareValidator({
		paramsSchema: idParamSchema,
		querySchema: dateQuerySchemaRequired
	}),
	bookings_controller.check_single_room
);

//Check if multiple Rooms by ID are available
bookings_routes.get(
	'/rooms',
	zodMiddlewareValidator({
		querySchema: check_multiple_rooms_by_ids_query_schema
	}),
	bookings_controller.check_multiple_rooms
);

//Check if multiple Rooms by roomType are available
bookings_routes.get(
	'/rooms/roomType/:roomType',
	zodMiddlewareValidator({
		paramsSchema: z.object({
			roomType: roomTypeSchema
		}),
		querySchema: check_multiple_rooms_by_roomType_query_schema
	}),
	bookings_controller.check_multiple_rooms_by_roomType
);

// Check if multiple Rooms by city id are available
bookings_routes.get(
	'/rooms/city/:cityId',
	zodMiddlewareValidator({
		paramsSchema: z.object({
			cityId: z.coerce.number().int().positive()
		}),
		querySchema: check_multiple_rooms_by_cityId_query_schema
	}),
	bookings_controller.check_multiple_rooms_by_cityId
);

// Check if multiple Rooms by city name are available
bookings_routes.get(
	'/rooms/city/name/:cityName',
	zodMiddlewareValidator({
		paramsSchema: z.object({
			cityName: z.string().trim().nonempty()
		}),
		querySchema: check_multiple_rooms_by_cityId_query_schema
	}),
	bookings_controller.check_multiple_rooms_by_cityName
);

// //Create Booking for single Room
// bookings_routes.post(
// 	'/rooms/:id',
// 	zodMiddlewareValidator({
// 		querySchema: dateQuerySchemaRequired,
// 		paramsSchema: idParamSchema
// 	}),
// 	bookings_controller.create_booking_single_room
// );

// //Create Booking for multiple Rooms
// bookings_routes.post(
// 	'/rooms',
// 	zodMiddlewareValidator({
// 		querySchema: check_multiple_rooms_query_schema
// 	}),
// 	bookings_controller.create_booking_multiple_rooms
// );

export default bookings_routes;
