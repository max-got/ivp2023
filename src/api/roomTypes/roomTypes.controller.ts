import { NextFunction, Request, Response } from 'express';
import prisma from 'src/prisma';

// Get all RoomTypes
export const getAllRoomTypes = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const rooms = await prisma.room.findMany({
			select: {
				roomType: true
			}
		});

		const roomTypeSet = new Set(rooms.map((room) => room.roomType));

		res.json(Array.from(roomTypeSet));
	} catch (error) {
		next(error);
	}
};
