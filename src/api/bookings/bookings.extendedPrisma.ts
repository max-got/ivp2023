import { Prisma, RoomType } from '@prisma/client';
import prisma from 'src/prisma/';

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
			}
		}
	}
});
