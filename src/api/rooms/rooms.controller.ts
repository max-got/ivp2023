import { Prisma, RoomType } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { ResponseError } from 'src/utils/errorHandler';
import { extendedPrisma } from './rooms.extendedPrisma';

const INCLUDE_STATEMENT = {
	hotel: {
		select: {
			city: {
				select: {
					name: true
				}
			},
			name: true,
			address: true
		}
	}
} satisfies Prisma.RoomInclude;

//Get all Rooms
export const get_all_rooms = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { startDate, endDate } = req.query;

		const rooms = await extendedPrisma.room.findManyAndCheckOptionalIfAvailableInDateRange(
			{
				include: { ...INCLUDE_STATEMENT }
			},
			startDate as string,
			endDate as string
		);

		if (!rooms) {
			throw new ResponseError('Keine Zimmer gefunden', 404);
		}

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

//Get Room by id
export const get_room_by_id = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const { startDate, endDate } = req.query;

		const room = await extendedPrisma.room.findUniqueAndCheckOptionalIfAvailableInDateRange(
			{
				where: {
					id: Number(id)
				},
				include: { ...INCLUDE_STATEMENT }
			},
			startDate as string,
			endDate as string
		);

		if (!room) {
			throw new ResponseError('Zimmer nicht gefunden', 404);
		}

		res.json(room);
	} catch (error) {
		next(error);
	}
};

//Get Rooms by Hotel id
export const get_rooms_by_hotel_id = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const { startDate, endDate } = req.query;

		const rooms = await extendedPrisma.room.findManyAndCheckOptionalIfAvailableInDateRange(
			{
				where: {
					hotelId: Number(id)
				},
				include: { ...INCLUDE_STATEMENT }
			},
			startDate as string,
			endDate as string
		);

		if (rooms.length === 0) {
			throw new ResponseError('Keine Zimmer gefunden', 404);
		}

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

//Get Rooms by Hotel name
export const get_rooms_by_hotel_name = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name } = req.params;
		const { startDate, endDate } = req.query;

		const rooms = await extendedPrisma.room.findManyAndCheckOptionalIfAvailableInDateRange(
			{
				where: {
					hotel: {
						name: {
							contains: name,
							mode: 'insensitive'
						}
					}
				},
				include: { ...INCLUDE_STATEMENT }
			},
			startDate as string,
			endDate as string
		);

		if (!rooms || rooms.length === 0) {
			throw new ResponseError('Keine Zimmer gefunden', 404);
		}

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

// Get Rooms by City name
export const get_rooms_by_city_name = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name } = req.params;
		const { startDate, endDate } = req.query;

		const rooms = await extendedPrisma.room.findManyAndCheckOptionalIfAvailableInDateRange(
			{
				where: {
					hotel: {
						city: {
							name: {
								contains: name,
								mode: 'insensitive'
							}
						}
					}
				},
				include: { ...INCLUDE_STATEMENT }
			},
			startDate as string,
			endDate as string
		);

		if (!rooms || rooms.length === 0) {
			throw new ResponseError('Keine Zimmer gefunden', 404);
		}

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

// Get Rooms by City id
export const get_rooms_by_city_id = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const { startDate, endDate } = req.query;

		const rooms = await extendedPrisma.room.findManyAndCheckOptionalIfAvailableInDateRange(
			{
				where: {
					hotel: {
						cityId: Number(id)
					}
				},
				include: { ...INCLUDE_STATEMENT }
			},
			startDate as string,
			endDate as string
		);

		if (!rooms || rooms.length === 0) {
			throw new ResponseError('Keine Zimmer gefunden', 404);
		}

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

// Get Rooms by City name and Hotel name
export const get_rooms_by_city_name_and_hotel_name = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { city, hotel } = req.params;
		const { startDate, endDate } = req.query;

		const rooms = await extendedPrisma.room.findManyAndCheckOptionalIfAvailableInDateRange(
			{
				where: {
					hotel: {
						city: {
							name: {
								contains: city,
								mode: 'insensitive'
							}
						},
						name: {
							contains: hotel,
							mode: 'insensitive'
						}
					}
				},
				include: { ...INCLUDE_STATEMENT }
			},
			startDate as string,
			endDate as string
		);

		if (!rooms || rooms.length === 0) {
			throw new ResponseError('Keine Zimmer gefunden', 404);
		}

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

// Get Rooms by City id and Hotel id
export const get_rooms_by_city_id_and_hotel_id = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { cityId, hotelId } = req.params;
		const { startDate, endDate } = req.query;

		const rooms = await extendedPrisma.room.findManyAndCheckOptionalIfAvailableInDateRange(
			{
				where: {
					hotel: {
						cityId: Number(cityId),
						id: Number(hotelId)
					}
				},
				include: { ...INCLUDE_STATEMENT }
			},
			startDate as string,
			endDate as string
		);

		if (!rooms || rooms.length === 0) {
			throw new ResponseError('Keine Zimmer gefunden', 404);
		}

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

// Get Rooms by roomType

export const get_rooms_by_roomType = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { roomType } = req.params as { roomType: RoomType };
		const { startDate, endDate } = req.query;

		const rooms = await extendedPrisma.room.findManyAndCheckOptionalIfAvailableInDateRange(
			{
				where: {
					roomType: {
						equals: roomType
					}
				},
				include: {
					...INCLUDE_STATEMENT
				}
			},
			startDate as string,
			endDate as string
		);

		if (!rooms || rooms.length === 0) {
			throw new ResponseError('Keine Zimmer gefunden', 404);
		}

		res.json(rooms);
	} catch (error) {
		next(error);
	}
};
