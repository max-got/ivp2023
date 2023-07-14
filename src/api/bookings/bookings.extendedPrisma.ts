import { Prisma } from '@prisma/client';
import prisma from 'src/prisma/';
import { ResponseError } from 'src/utils/errorHandler';
import {
	CreateBookingSingleRoomByIdArgs,
	FindManyCheckIfRoomsByIdsAreAvailableArgs,
	FindManyRoomsByCitynameThatAreAvailableArgs,
	FindManyRoomsByRoomtypeThatAreAvailableArgs,
	FindUniqueCheckIfRoomByIdIsAvailableArgs,
	Result
} from './bookings.types';

export const extendedPrisma = prisma.$extends({
	name: 'bookings',
	model: {
		booking: {
			findUniqueCheckIfRoomByIdIsAvailable: async ({
				id,
				startDate,
				endDate
			}: FindUniqueCheckIfRoomByIdIsAvailableArgs) => {
				// Check if room exists
				const room = await prisma.room.findUnique({
					where: {
						id
					}
				});

				if (!room) {
					throw new ResponseError('Room not found', 404);
				}

				const bookings = (await prisma.$queryRaw`
				SELECT
				(SELECT JSON_BUILD_OBJECT('roomId', "Booking"."roomId", 'number', "Room"."number", 'roomType', "Room"."roomType" )) AS "room",
				(SELECT JSON_BUILD_OBJECT('hotelId', "Hotel"."id", 'hotelName', "Hotel"."name")) AS "hotel",
				(SELECT JSON_BUILD_OBJECT('cityId', "City"."id", 'cityName', "City"."name" )) AS "city"
				FROM "Booking"
				JOIN "Room" ON "Booking"."roomId" = "Room"."id"
				JOIN "Hotel" ON "Room"."hotelId" = "Hotel"."id"
				JOIN "City" ON "Hotel"."cityId" = "City"."id"
				WHERE "Booking"."roomId" = ${id}
				AND "Booking"."startDate" <= ${endDate} AND "Booking"."endDate" >= ${startDate}
				`) as Record<string, string>[];
				//if there is a booking, the room is not available
				if (bookings.length > 0) {
					throw new ResponseError('Room not available', 409);
				}

				return true;
			},

			findManyCheckIfRoomsByIdsAreAvailable: async ({
				ids,
				startDate,
				endDate
			}: FindManyCheckIfRoomsByIdsAreAvailableArgs) => {
				//raw sql query, which returns the {roomId: number, isAvailable: boolean}[]
				console.log(ids);
				const bookings = (await prisma.$queryRaw`
				SELECT
				(SELECT JSON_BUILD_OBJECT('roomId', "Booking"."roomId", 'number', "Room"."number", 'roomType', "Room"."roomType" )) AS "room",
				(SELECT JSON_BUILD_OBJECT('hotelId', "Hotel"."id", 'hotelName', "Hotel"."name")) AS "hotel",
				(SELECT JSON_BUILD_OBJECT('cityId', "City"."id", 'cityName', "City"."name" )) AS "city"
				FROM "Booking"
				JOIN "Room" ON "Booking"."roomId" = "Room"."id"
				JOIN "Hotel" ON "Room"."hotelId" = "Hotel"."id"
				JOIN "City" ON "Hotel"."cityId" = "City"."id"
				WHERE "Booking"."roomId" IN (${Prisma.join(ids)})
				AND "Booking"."startDate" <= ${endDate} AND "Booking"."endDate" >= ${startDate}
				`) as Record<string, string>[];

				if (bookings.length > 0) {
					throw new ResponseError('Rooms not available', 409);
				}

				return true;
			},

			findManyRoomsByRoomtypeThatAreAvailable: async ({
				roomType,
				startDate,
				endDate,
				cityName,
				hotelName
			}: FindManyRoomsByRoomtypeThatAreAvailableArgs) => {
				console.log(roomType, startDate, endDate, cityName, hotelName);
				const bookings = (await prisma.$queryRaw`
				SELECT
				(SELECT JSON_BUILD_OBJECT('roomId', "Room"."id", 'number', "Room"."number", 'roomType', "Room"."roomType")) AS "room",
				(SELECT JSON_BUILD_OBJECT('hotelId', "Hotel"."id", 'hotelName', "Hotel"."name")) AS "hotel",
				(SELECT JSON_BUILD_OBJECT('cityId', "City"."id", 'cityName', "City"."name")) AS "city"
				FROM "Room"
				JOIN "Hotel" ON "Room"."hotelId" = "Hotel"."id"
				JOIN "City" ON "Hotel"."cityId" = "City"."id"
				LEFT JOIN "Booking" ON "Booking"."roomId" = "Room"."id"
				AND "Booking"."startDate" <= ${endDate}
				AND "Booking"."endDate" >= ${startDate}
				WHERE "Room"."roomType"::text = ${roomType}::text
				${cityName ? Prisma.sql`AND "City"."name" = ${cityName}` : Prisma.empty}
				${hotelName ? Prisma.sql`AND "Hotel"."name" = ${hotelName}` : Prisma.empty}
				AND "Booking"."roomId" IS NULL
				`) as Result[];

				if (bookings.length === 0) {
					throw new ResponseError('There are no rooms available', 409);
				}

				return bookings;
			},

			findManyRoomsByCitynameThatAreAvailable: async ({
				cityName,
				startDate,
				endDate,
				hotelName,
				roomType
			}: FindManyRoomsByCitynameThatAreAvailableArgs) => {
				console.log(cityName, startDate, endDate, hotelName, roomType);
				const bookings = (await prisma.$queryRaw`
				SELECT
				(SELECT JSON_BUILD_OBJECT('roomId', "Booking"."roomId", 'number', "Room"."number", 'roomType', "Room"."roomType" )) AS "room",
				(SELECT JSON_BUILD_OBJECT('hotelId', "Hotel"."id", 'hotelName', "Hotel"."name")) AS "hotel",
				(SELECT JSON_BUILD_OBJECT('cityId', "City"."id", 'cityName', "City"."name" )) AS "city"
				FROM "Booking"
				JOIN "Room" ON "Booking"."roomId" = "Room"."id"
				JOIN "Hotel" ON "Room"."hotelId" = "Hotel"."id"
				JOIN "City" ON "Hotel"."cityId" = "City"."id"
				WHERE "City"."name" = ${cityName}
				${roomType ? Prisma.sql`AND "Room"."roomType"::text = ${roomType}::text` : Prisma.empty}
				${hotelName ? Prisma.sql`AND "Hotel"."name" = ${hotelName}` : Prisma.empty}
				AND ("Booking"."startDate" > ${endDate} OR "Booking"."endDate" < ${startDate});
				`) as Result[];

				if (bookings.length === 0) {
					throw new ResponseError('There are no rooms available', 409);
				}

				return bookings;
			},

			createSingleRoomBookingById: async ({
				endDate,
				startDate,
				roomId,
				customerId,
				address,
				name,
				email
			}: CreateBookingSingleRoomByIdArgs) => {
				const room = await prisma.room.findUnique({
					where: {
						id: roomId
					}
				});

				if (!room) {
					throw new ResponseError('Room does not exist', 400);
				}

				//check if room is available

				const check_if_booking_exists = (await prisma.$queryRaw`
				SELECT * FROM "Booking"
				WHERE "Booking"."roomId" = ${roomId}
				AND "Booking"."startDate" <= ${endDate}
				AND "Booking"."endDate" >= ${startDate}`) as string[];

				if (check_if_booking_exists.length > 0)
					throw new ResponseError('Room is not available for the given time period', 400);

				//if the email is provided, check if the customer already exists
				if (email) {
					const customer = await prisma.customer.findUnique({
						where: {
							email: email || undefined
						}
					});

					if (customer) {
						throw new ResponseError('Customer already exists, please use customerId', 400);
					}
				}

				//conditionally create a new customer or connect to an existing one
				//sieht scheiße aus, aber funktioniert
				const data = {
					startDate: startDate,
					endDate: endDate,
					room: {
						connect: {
							id: roomId
						}
					},
					...(customerId && {
						customer: {
							connect: {
								id: customerId
							}
						}
					}),
					...(!customerId && {
						customer: {
							create: {
								address: address,
								email: email,
								name: name
							}
						}
					})
				} as Prisma.BookingCreateInput;

				//create the booking
				const booking = await prisma.booking.create({
					data: data
				});

				//schau ob irgendwas nicht klappt
				if (!booking) {
					throw new ResponseError('Booking could not be created', 500);
				}

				return booking;
			}
		}
	}
});
