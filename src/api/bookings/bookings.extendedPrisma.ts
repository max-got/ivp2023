import { Prisma, RoomType } from '@prisma/client';
import prisma from 'src/prisma/';
import { ResponseError } from 'src/utils/errorHandler';

interface StartDateEndDate {
	startDate: Date;
	endDate: Date;
}

export type findManyCheckIfRoomsAreAvailableResult = findManyCheckIfRoomsAreAvailable[];

export interface findManyCheckIfRoomsAreAvailable {
	room: Room;
	hotel: Hotel;
	city: City;
	isAvailable: boolean;
}

export interface Room {
	roomId: number;
	number: number;
	roomType: string;
}

export interface Hotel {
	hotelId: number;
	hotelName: string;
}

export interface City {
	cityId: number;
	cityName: string;
}

interface FindUniqueCheckIfRoomByIdIsAvailableArgs extends StartDateEndDate {
	id: number;
}

interface FindManyCheckIfRoomsByIdsAreAvailableArgs extends StartDateEndDate {
	ids: number[];
}

interface FindManyCheckIfRoomsByRoomTypeAreAvailableArgs extends StartDateEndDate {
	roomType: RoomType;
}

interface FindManyCheckIfRoomsByCityIdAreAvailableArgs extends StartDateEndDate {
	cityId: number;
}

interface FindManyCheckIfRoomsByCityNameAreAvailableArgs extends StartDateEndDate {
	cityName: string;
}

interface CreateBookingSingleRoomByIdArgsCustomerId extends StartDateEndDate {
	roomId: number;
	customerId: number;
	name: undefined;
	email: undefined;
	address: undefined;
}

interface CreateBookingSingleRoomByIdArgsNewCustomer extends StartDateEndDate {
	roomId: number;
	customerId: undefined;
	name: string;
	email: string;
	address: string;
}

type CreateBookingSingleRoomByIdArgs =
	| CreateBookingSingleRoomByIdArgsNewCustomer
	| CreateBookingSingleRoomByIdArgsCustomerId;

export const extendedPrisma = prisma.$extends({
	name: 'bookings',
	model: {
		booking: {
			findUniqueCheckIfRoomByIdIsAvailable: async ({
				id,
				startDate,
				endDate
			}: FindUniqueCheckIfRoomByIdIsAvailableArgs) => {
				const bookings = await prisma.booking.findUnique({
					where: {
						id
					}
				});

				if (!bookings) {
					return null;
				}

				const isAvailable = bookings.startDate > endDate || bookings.endDate < startDate;

				return {
					roomId: bookings.roomId,
					isAvailable
				};
			},

			findManyCheckIfRoomsByIdsAreAvailable: async ({
				ids,
				startDate,
				endDate
			}: FindManyCheckIfRoomsByIdsAreAvailableArgs) => {
				//raw sql query, which returns the {roomId: number, isAvailable: boolean}[]
				const bookings = (await prisma.$queryRaw`
				SELECT
				(SELECT JSON_BUILD_OBJECT('roomId', "Booking"."roomId", 'number', "Room"."number", 'roomType', "Room"."roomType" )) AS "room",
				(SELECT JSON_BUILD_OBJECT('hotelId', "Hotel"."id", 'hotelName', "Hotel"."name")) AS "hotel",
				(SELECT JSON_BUILD_OBJECT('cityId', "City"."id", 'cityName', "City"."name" )) AS "city",
				CASE WHEN "Booking"."startDate" <= ${endDate} AND "Booking"."endDate" >= ${startDate} THEN false ELSE true END AS "isAvailable"
				FROM "Booking"
				JOIN "Room" ON "Booking"."roomId" = "Room"."id"
				JOIN "Hotel" ON "Room"."hotelId" = "Hotel"."id"
				JOIN "City" ON "Hotel"."cityId" = "City"."id"
				WHERE "Booking"."roomId" IN (${Prisma.join(ids)})`) as findManyCheckIfRoomsAreAvailableResult;

				if (bookings.length === 0) {
					return [];
				}

				return bookings;
			},

			findManyCheckIfRoomsByRoomTypeAreAvailable: async ({
				roomType,
				startDate,
				endDate
			}: FindManyCheckIfRoomsByRoomTypeAreAvailableArgs) => {
				console.log(roomType, startDate, endDate);
				//raw sql query, which returns the {roomId: number, isAvailable: boolean}[]
				const bookings = (await prisma.$queryRaw`
				SELECT
				(SELECT JSON_BUILD_OBJECT('roomId', "Booking"."roomId", 'number', "Room"."number", 'roomType', "Room"."roomType" )) AS "room",
				(SELECT JSON_BUILD_OBJECT('hotelId', "Hotel"."id", 'hotelName', "Hotel"."name")) AS "hotel",
				(SELECT JSON_BUILD_OBJECT('cityId', "City"."id", 'cityName', "City"."name" )) AS "city",
				CASE WHEN "Booking"."startDate" <= ${endDate} AND "Booking"."endDate" >= ${startDate} THEN false ELSE true END AS "isAvailable"
				FROM "Booking"
				JOIN "Room" ON "Booking"."roomId" = "Room"."id"
				JOIN "Hotel" ON "Room"."hotelId" = "Hotel"."id"
				JOIN "City" ON "Hotel"."cityId" = "City"."id"
				WHERE "Room"."roomType"::text = ${roomType}::text`) as findManyCheckIfRoomsAreAvailableResult;

				if (bookings.length === 0) {
					return [];
				}

				return bookings;
			},

			findManyCheckIfRoomsByCityIdAreAvailable: async ({
				cityId,
				startDate,
				endDate
			}: FindManyCheckIfRoomsByCityIdAreAvailableArgs) => {
				//raw sql query, which returns the {roomId: number, isAvailable: boolean}[]
				const bookings = (await prisma.$queryRaw`
				SELECT
				(SELECT JSON_BUILD_OBJECT('roomId', "Booking"."roomId", 'number', "Room"."number", 'roomType', "Room"."roomType" )) AS "room",
				(SELECT JSON_BUILD_OBJECT('hotelId', "Hotel"."id", 'hotelName', "Hotel"."name")) AS "hotel",
				(SELECT JSON_BUILD_OBJECT('cityId', "City"."id", 'cityName', "City"."name" )) AS "city",
				CASE WHEN "Booking"."startDate" <= ${endDate} AND "Booking"."endDate" >= ${startDate} THEN false ELSE true END AS "isAvailable"
				FROM "Booking"
				JOIN "Room" ON "Booking"."roomId" = "Room"."id"
				JOIN "Hotel" ON "Room"."hotelId" = "Hotel"."id"
				JOIN "City" ON "Hotel"."cityId" = "City"."id"
				WHERE "City"."id" = ${cityId}`) as findManyCheckIfRoomsAreAvailableResult;

				if (bookings.length === 0) {
					return [];
				}

				return bookings;
			},

			findManyCheckIfRoomsByCityNameAreAvailable: async ({
				cityName,
				startDate,
				endDate
			}: FindManyCheckIfRoomsByCityNameAreAvailableArgs) => {
				//raw sql query, which returns the {roomId: number, isAvailable: boolean}[]
				const bookings = (await prisma.$queryRaw`
				SELECT
				(SELECT JSON_BUILD_OBJECT('roomId', "Booking"."roomId", 'number', "Room"."number", 'roomType', "Room"."roomType" )) AS "room",
				(SELECT JSON_BUILD_OBJECT('hotelId', "Hotel"."id", 'hotelName', "Hotel"."name")) AS "hotel",
				(SELECT JSON_BUILD_OBJECT('cityId', "City"."id", 'cityName', "City"."name" )) AS "city",
				CASE WHEN "Booking"."startDate" <= ${endDate} AND "Booking"."endDate" >= ${startDate} THEN false ELSE true END AS "isAvailable"
				FROM "Booking"
				JOIN "Room" ON "Booking"."roomId" = "Room"."id"
				JOIN "Hotel" ON "Room"."hotelId" = "Hotel"."id"
				JOIN "City" ON "Hotel"."cityId" = "City"."id"
				WHERE "City"."name" = ${cityName}`) as findManyCheckIfRoomsAreAvailableResult;

				if (bookings.length === 0) {
					return [];
				}

				return bookings;
			},

			createBookingSingleRoomById: async ({
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
