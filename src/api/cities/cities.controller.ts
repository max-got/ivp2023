import { NextFunction, Request, Response } from 'express';
import prisma from 'src/prisma';

// Get all Cities
export const getAllCities = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cities = await prisma.city.findMany();

		res.json(cities);
	} catch (error) {
		next(error);
	}
};
