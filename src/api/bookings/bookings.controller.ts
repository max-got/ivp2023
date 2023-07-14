import { NextFunction, Request, Response } from 'express';
import { extendedPrisma } from './bookings.extendedPrisma';
import { RoomType } from '@prisma/client';

// Check if single Room by Id is available
export const findUniqueCheckIfRoomByIdIsAvailable = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { startDate, endDate } = req.query;

		const room = await extendedPrisma.booking.findUniqueCheckIfRoomByIdIsAvailable({
			id: Number(id),
			startDate: new Date(startDate as string),
			endDate: new Date(endDate as string)
		});

		res.json(room);
	} catch (error) {
		next(error);
	}
};

//Check if multiple Rooms by Ids are available
export const findManyCheckIfRoomsByIdsAreAvailable = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ids } = req.query;
		const { startDate, endDate } = req.query;

		const rooms = await extendedPrisma.booking.findManyCheckIfRoomsByIdsAreAvailable({
			ids: (ids as string).split(',').map((id) => Number(id)),
			startDate: new Date(startDate as string),
			endDate: new Date(endDate as string)
		});

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

//Check if multiple Rooms by roomType are available
export const findManyRoomsByRoomtypeThatAreAvailable = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { roomType } = req.params;
		const { startDate, endDate, cityName, hotelName } = req.query;

		const rooms = await extendedPrisma.booking.findManyRoomsByRoomtypeThatAreAvailable({
			roomType: roomType as RoomType,
			startDate: new Date(startDate as string),
			endDate: new Date(endDate as string),
			cityName: cityName as string,
			hotelName: hotelName as string
		});

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

// Check if multiple Rooms by city name are available
export const roomsByCitynameThatAreAvailable = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { cityName } = req.params;
		const { startDate, endDate, roomType, hotelName } = req.query;

		const rooms = await extendedPrisma.booking.findManyRoomsByCitynameThatAreAvailable({
			cityName: cityName as string,
			startDate: new Date(startDate as string),
			endDate: new Date(endDate as string),
			roomType: roomType as RoomType,
			hotelName: hotelName as string
		});

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

// Create a new Booking for a single Room
export const createSingleRoomBookingById = async (
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

		const booking = await extendedPrisma.booking.createSingleRoomBookingById(data);

		res.json(booking);
	} catch (error) {
		next(error);
	}
};
