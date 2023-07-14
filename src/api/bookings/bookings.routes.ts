import express from 'express';
const bookings_routes = express.Router();

import * as bookings_controller from './bookings.controller';
import { zodMiddlewareValidator } from 'src/middlewares/zod';
import * as schema from './bookings.zod';

// Check if single Room by ID is available
bookings_routes.get(
	/* #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID des Raumes',
        required: true,
        type: 'integer',
        } */

	/* #swagger.parameters['startDate'] = {
        in: 'query',
        description: 'Startdatum der Buchung (Date)',
        required: true,
        type: 'string',
		example: '2021-01-01'
        } */

	/* #swagger.parameters['endDate'] = {
        in: 'query',
        description: 'Enddatum der Buchung (Date)',
        required: true,
        type: 'string',
		example: '2021-02-01'
        } */

	// #swagger.description = 'Check if single Room is available'
	'/rooms/:id',
	zodMiddlewareValidator({
		paramsSchema: schema.idParamSchema,
		querySchema: schema.dateQuerySchemaRequired
	}),
	bookings_controller.findUniqueCheckIfRoomByIdIsAvailable
);

//Check if multiple Rooms by ID are available
bookings_routes.get(
	/* #swagger.parameters['ids'] = {
        in: 'query',
        description: 'IDs der Räume (comma separated)',
        required: true,
        type: 'string'
        } */

	/* #swagger.parameters['startDate'] = {
        in: 'query',
        description: 'Startdatum der Buchung (Date)',
        required: true,
		type: 'string',
		example: '2021-01-01'
        } */

	/* #swagger.parameters['endDate'] = {
        in: 'query',
        description: 'Enddatum der Buchung (Date)',
        required: true,
        type: 'string',
		example: '2021-02-01'
        } */

	// #swagger.description = 'Check if multiple Rooms are available'
	'/rooms',
	zodMiddlewareValidator(schema.findManyCheckIfRoomsByIdsAreAvailable),
	bookings_controller.findManyCheckIfRoomsByIdsAreAvailable
);

//Check if multiple Rooms by roomType are available
bookings_routes.get(
	/* #swagger.parameters['roomType'] = {
		in: 'path',
		description: 'Raumtyp',
		required: true,
		type: 'string'
		} */

	/* #swagger.parameters['startDate'] = {
		in: 'query',
		description: 'Startdatum der Buchung (Date)',
		required: true,
		type: 'string',
		example: '2021-01-01'
		} */

	/* #swagger.parameters['endDate'] = {
		in: 'query',
		description: 'Enddatum der Buchung (Date)',
		required: true,
		type: 'string',
		example: '2021-02-01'
		} */

	/* #swagger.parameters['cityName'] = {
		in: 'query',
		description: 'Name der Stadt',
		required: false,
		type: 'string',
		example: 'Berlin'
		} */

	/* #swagger.parameters['hotelName'] = {
		in: 'query',
		description: 'Name des Hotels',
		required: false,
		type: 'string'
		} */

	// #swagger.description = 'Check if multiple Rooms by roomType are available'
	'/rooms/roomType/:roomType',
	zodMiddlewareValidator(schema.findManyRoomsByRoomtypeThatAreAvailable),
	bookings_controller.findManyRoomsByRoomtypeThatAreAvailable
);

// Check if multiple Rooms by city name are available
bookings_routes.get(
	/* #swagger.parameters['cityName'] = {
		in: 'path',
		description: 'Name der Stadt',
		required: true,
		type: 'string'
		} 

		#swagger.parameters['startDate'] = {
		in: 'query',
		description: 'Startdatum der Buchung (Date)',
		required: true,
		type: 'string',
		example: '2021-01-01'
		} 

		#swagger.parameters['endDate'] = {
		in: 'query',
		description: 'Enddatum der Buchung (Date)',
		required: true,
		type: 'string',
		example: '2021-02-01'
		} */

	// #swagger.description = 'Check if multiple Rooms by city name are available'

	'/rooms/city/name/:cityName',
	zodMiddlewareValidator(schema.roomsByCitynameThatAreAvailable),
	bookings_controller.roomsByCitynameThatAreAvailable
);

//Create Booking for single Room
bookings_routes.post(
	/* 

		#swagger.parameters['roomId'] = {
		in: 'path',
		description: 'ID des Raumes',
		required: true,
		type: 'integer',
		} 
		
		#swagger.parameters['obj'] = {
		in: 'body',
		description: 'Objekt mit den Daten der Buchung',
		required: true,
		schema: {
			"startDate": "2021-01-01T00:00:00.000Z",
			"endDate": "2021-02-01T00:00:00.000Z",
			"customerId": 1,
			"name": "Max Mustermann",
			"email": "max@mustermann.de",
			"address": "Musterstraße 1, 12345 Musterstadt"
		}
		} 
		
		*/
	'/rooms/:roomId',
	zodMiddlewareValidator(schema.createSingleRoomBookingById),
	bookings_controller.createSingleRoomBookingById
);

// //Create Booking for multiple Rooms
// bookings_routes.post(
// 	'/rooms',
// 	zodMiddlewareValidator({
// 		querySchema: check_multiple_rooms_query_schema
// 	}),
// 	bookings_controller.create_booking_multiple_rooms
// );

export default bookings_routes;
