import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { ResponseError } from 'src/utils/errorHandler';
import prisma from 'src/prisma';

const INCLUDE_STATEMENT = {
	city: {
		select: {
			name: true
		}
	},
	rooms: {
		select: {
			number: true,
			roomType: true,
			price: true,
			currency: true
		}
	}
} satisfies Prisma.HotelInclude;

//Get all Hotels
export const get_all_hotels = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const hotels = await prisma.hotel.findMany({
			include: { ...INCLUDE_STATEMENT }
		});

		if (!hotels || hotels.length === 0) {
			throw new ResponseError('Keine Hotels gefunden', 404);
		}

		res.json(hotels);
	} catch (error) {
		next(error);
	}
};

//Get Hotel by id
export const get_hotel_by_id = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const hotel = await prisma.hotel.findUnique({
			where: {
				id: Number(id)
			},
			include: { ...INCLUDE_STATEMENT }
		});

		if (!hotel) {
			throw new ResponseError('Hotel nicht gefunden', 404);
		}

		res.json(hotel);
	} catch (error) {
		next(error);
	}
};

// Get Hotel by Name
export const get_hotel_by_name = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name } = req.params;

		const hotel = await prisma.hotel.findMany({
			where: {
				name: name
			},
			include: { ...INCLUDE_STATEMENT }
		});

		if (!hotel || hotel.length === 0) {
			throw new ResponseError('Hotel nicht gefunden', 404);
		}

		res.json(hotel);
	} catch (error) {
		next(error);
	}
};

//Get Hotel by city
export const get_hotel_by_city = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { city } = req.params;

		const hotel = await prisma.hotel.findMany({
			where: {
				city: {
					name: city
				}
			},
			include: { ...INCLUDE_STATEMENT }
		});

		if (!hotel || hotel.length === 0) {
			throw new ResponseError('Hotel nicht gefunden', 404);
		}

		res.json(hotel);
	} catch (error) {
		next(error);
	}
};

//Get Hotel by city and id
export const get_hotel_by_city_and_id = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { city, id } = req.params;

		const hotel = await prisma.hotel.findFirst({
			where: {
				AND: [
					{
						id: Number(id)
					},
					{
						city: {
							name: city
						}
					}
				]
			},
			include: { ...INCLUDE_STATEMENT }
		});

		if (!hotel) {
			throw new ResponseError('Hotel nicht gefunden', 404);
		}

		res.json(hotel);
	} catch (error) {
		next(error);
	}
};

//Get Hotel by city and name
export const get_hotel_by_city_and_name = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { city, name } = req.params;

		const hotel = await prisma.hotel.findFirst({
			where: {
				AND: [
					{
						name: name
					},
					{
						city: {
							name: city
						}
					}
				]
			},
			include: { ...INCLUDE_STATEMENT }
		});

		if (!hotel) {
			throw new ResponseError('Hotel nicht gefunden', 404);
		}

		res.json(hotel);
	} catch (error) {
		next(error);
	}
};
