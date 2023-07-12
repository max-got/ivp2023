import { NextFunction, Request, Response } from 'express';
import { ResponseError } from 'src/utils/errorHandler';
import { extendedPrisma } from './bookings.extendedPrisma';
import { RoomType } from '@prisma/client';

// Check if single Room by Id is available
export const check_single_room = async (req: Request, res: Response, next: NextFunction) => {
	/* #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID des Raumes',
        required: true,
        type: 'integer'
        } */

	/* #swagger.parameters['startDate'] = {
        in: 'query',
        description: 'Startdatum der Buchung (Date)',
        required: true,
        type: 'string'
        } */

	/* #swagger.parameters['endDate'] = {
        in: 'query',
        description: 'Enddatum der Buchung (Date)',
        required: true,
        type: 'string'
        } */

	// #swagger.description = 'Check if single Room is available'
	try {
		const { id } = req.params;
		const { startDate, endDate } = req.query;

		const room = await extendedPrisma.booking.findUniqueCheckIfRoomByIdIsAvailable({
			id: Number(id),
			startDate: new Date(startDate as string),
			endDate: new Date(endDate as string)
		});

		if (!room) {
			throw new ResponseError('Room not found', 404);
		}

		res.json(room);
	} catch (error) {
		next(error);
	}
};

//Check if multiple Rooms by Ids are available
export const check_multiple_rooms = async (req: Request, res: Response, next: NextFunction) => {
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
        type: 'string'
        } */

	/* #swagger.parameters['endDate'] = {
        in: 'query',
        description: 'Enddatum der Buchung (Date)',
        required: true,
        type: 'string'
        } */

	// #swagger.description = 'Check if multiple Rooms are available'
	try {
		const { ids } = req.query;
		const { startDate, endDate } = req.query;

		const rooms = await extendedPrisma.booking.findManyCheckIfRoomsByIdsAreAvailable({
			ids: (ids as string).split(',').map((id) => Number(id)),
			startDate: new Date(startDate as string),
			endDate: new Date(endDate as string)
		});

		if (!rooms || rooms.length === 0) {
			throw new ResponseError('Keine Räume verfügbar', 404);
		}

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

//Check if multiple Rooms by roomType are available
export const check_multiple_rooms_by_roomType = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	/* #swagger.parameters['roomType'] = {
		in: 'query',
		description: 'Raumtyp',
		required: true,
		type: 'string'
		} */

	/* #swagger.parameters['startDate'] = {
		in: 'query',
		description: 'Startdatum der Buchung (Date)',
		required: true,
		type: 'string'
		} */

	/* #swagger.parameters['endDate'] = {
		in: 'query',
		description: 'Enddatum der Buchung (Date)',
		required: true,
		type: 'string'
		} */

	// #swagger.description = 'Check if multiple Rooms by roomType are available'
	try {
		const { roomType } = req.params;
		const { startDate, endDate } = req.query;

		const rooms = await extendedPrisma.booking.findManyCheckIfRoomsByRoomTypeAreAvailable({
			roomType: roomType as RoomType,
			startDate: new Date(startDate as string),
			endDate: new Date(endDate as string)
		});

		if (!rooms || rooms.length === 0) {
			throw new ResponseError('Keine Räume verfügbar', 404);
		}

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

// Check if multiple Rooms by city id are available
export const check_multiple_rooms_by_cityId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	/* #swagger.parameters['cityId'] = {
		in: 'query',
		description: 'ID der Stadt',
		required: true,
		type: 'integer'
		} */

	/* #swagger.parameters['startDate'] = {
		in: 'query',
		description: 'Startdatum der Buchung (Date)',
		required: true,
		type: 'string'
		} */

	/* #swagger.parameters['endDate'] = {
		in: 'query',
		description: 'Enddatum der Buchung (Date)',
		required: true,
		type: 'string'
		} */

	// #swagger.description = 'Check if multiple Rooms by city id are available'
	try {
		const { cityId } = req.params;
		const { startDate, endDate } = req.query;

		const rooms = await extendedPrisma.booking.findManyCheckIfRoomsByCityIdAreAvailable({
			cityId: Number(cityId),
			startDate: new Date(startDate as string),
			endDate: new Date(endDate as string)
		});

		if (!rooms || rooms.length === 0) {
			throw new ResponseError('Keine Räume verfügbar', 404);
		}

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

// Check if multiple Rooms by city name are available
export const check_multiple_rooms_by_cityName = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	/* #swagger.parameters['cityName'] = {
		in: 'query',
		description: 'Name der Stadt',
		required: true,
		type: 'string'
		} */

	/* #swagger.parameters['startDate'] = {
		in: 'query',
		description: 'Startdatum der Buchung (Date)',
		required: true,
		type: 'string'
		} */

	/* #swagger.parameters['endDate'] = {
		in: 'query',
		description: 'Enddatum der Buchung (Date)',
		required: true,
		type: 'string'
		} */

	// #swagger.description = 'Check if multiple Rooms by city name are available'
	try {
		const { cityName } = req.params;
		const { startDate, endDate } = req.query;

		const rooms = await extendedPrisma.booking.findManyCheckIfRoomsByCityNameAreAvailable({
			cityName: cityName as string,
			startDate: new Date(startDate as string),
			endDate: new Date(endDate as string)
		});

		if (!rooms || rooms.length === 0) {
			throw new ResponseError('Keine Räume verfügbar', 404);
		}

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};


// Create a new Booking for a single Room
export const create_booking_single_room = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { roomId } = req.params;
		const { startDate, endDate, customerId, name, address, email } = req.body;

		const data = {
			roomId: Number(roomId),
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			...(customerId && { customerId: Number(customerId) }),
			...(!customerId && { name: name, address: address, email: email })
		};

		const booking = await extendedPrisma.booking.createBookingSingleRoomById(data);

		res.json(booking);
	} catch (error) {
		next(error);
	}
};

