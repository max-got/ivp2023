import { Prisma } from '@prisma/client';
import prisma from 'src/prisma/';

export const extendedPrisma = prisma.$extends({
	name: 'rooms',
	model: {
		room: {
			findManyAndCheckOptionalIfAvailableInDateRange: async (
				args: Prisma.RoomFindManyArgs,
				startDate: string,
				endDate: string
			) => {
				const rooms = await prisma.room.findMany(args);

				if (!startDate || !endDate) {
					return rooms;
				}

				//change startDate string to Date object
				const startDateObject = new Date(startDate);
				const endDateObject = new Date(endDate);

				const bookings = await prisma.booking.findMany({
					where: {
						roomId: {
							in: rooms.map((room) => room.id)
						}
					}
				});

				//add fiel "isAvailable" to each room if it is available in the given date range
				const roomsWithAvailability = rooms.map((room) => {
					const isAvailable = bookings.every(
						(booking) =>
							booking.bookingStartDate > endDateObject || booking.bookingEndDate < startDateObject
					);
					return { ...room, isAvailable };
				});

				return roomsWithAvailability;
			},
			findUniqueAndCheckOptionalIfAvailableInDateRange: async (
				args: Prisma.RoomFindUniqueArgs,
				startDate: string,
				endDate: string
			) => {
				const room = await prisma.room.findUnique(args);
				if (!room) {
					return room;
				}

				if (!startDate || !endDate) {
					return room;
				}

				//change startDate string to Date object
				const startDateObject = new Date(startDate);
				const endDateObject = new Date(endDate);

				const bookings = await prisma.booking.findMany({
					where: {
						roomId: {
							in: [room.id]
						}
					}
				});

				//add fiel "isAvailable" to each room if it is available in the given date range
				const roomWithAvailability = {
					...room,
					isAvailable: bookings.every(
						(booking) =>
							booking.bookingStartDate > endDateObject || booking.bookingEndDate < startDateObject
					)
				};

				return roomWithAvailability;
			}
		}
	}
});
