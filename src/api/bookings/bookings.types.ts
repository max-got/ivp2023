import { RoomType } from '@prisma/client';

interface StartDateEndDate {
	startDate: Date;
	endDate: Date;
}

export interface Result {
	room: Room;
	hotel: Hotel;
	city: City;
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

export interface FindUniqueCheckIfRoomByIdIsAvailableArgs extends StartDateEndDate {
	id: number;
}

export interface FindManyCheckIfRoomsByIdsAreAvailableArgs extends StartDateEndDate {
	ids: number[];
}

export interface FindManyRoomsByRoomtypeThatAreAvailableArgs extends StartDateEndDate {
	roomType: RoomType;
	cityName?: string;
	hotelName?: string;
}

export interface FindManyRoomsByCitynameThatAreAvailableArgs extends StartDateEndDate {
	cityName: string;
	roomType?: RoomType;
	hotelName?: string;
}

export interface CreateBookingSingleRoomByIdArgs extends StartDateEndDate {
	roomId: number;
	name: string;
	email: string;
	address: string;
}
