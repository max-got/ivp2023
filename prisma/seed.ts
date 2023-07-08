import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const STAEDTE = [
	'Berlin',
	'Hamburg',
	'München',
	'Köln',
	'Frankfurt',
	'Stuttgart',
] as const;

const ROOM_TYPES = ['single', 'double', 'suite'] as const;

type StadtSeed = Prisma.CityUncheckedCreateInput;
const create_stadt = async ({ name, id }: StadtSeed) => {
	const data = await prisma.city.upsert({
		where: {
			id: id,
		},
		update: {},
		create: {
			name: name,
		},
	});

	return data;
};

type HotelSeed = Prisma.HotelUncheckedCreateInput;
const create_hotel = async ({
	name,
	id,
	cityId,
	taxId,
	address,
}: HotelSeed) => {
	const data = await prisma.hotel.upsert({
		where: {
			id: id,
		},
		update: {},
		create: {
			name: name,
			address: address,
			taxId,
			city: {
				connect: {
					id: cityId,
				},
			},
		},
	});

	return data;
};

type RoomSeed = Prisma.RoomUncheckedCreateInput;
const create_room = async ({
	id,
	hotelId,
	number,
	roomType,
	price,
	currency,
}: RoomSeed) => {
	const data = await prisma.room.upsert({
		where: {
			id: id,
		},
		update: {},
		create: {
			number: number,
			roomType: roomType,
			price: price,
			currency: currency,
			hotel: {
				connect: {
					id: hotelId,
				},
			},
		},
	});

	return data;
};

type CustomerSeed = Prisma.CustomerUncheckedCreateInput;
const create_customer = async ({ id, name, email, address }: CustomerSeed) => {
	const data = await prisma.customer.upsert({
		where: {
			id: id,
		},
		update: {},
		create: {
			name: name,
			email: email,
			address: address,
		},
	});

	return data;
};

type ProviderSeed = Prisma.ProviderUncheckedCreateInput;
const create_provider = async ({ id, name, address, taxId }: ProviderSeed) => {
	const data = await prisma.provider.upsert({
		where: {
			id: id,
		},
		update: {},
		create: {
			name: name,
			address: address,
			taxId: taxId,
		},
	});

	return data;
};

type PackageSeed = Prisma.PackageUncheckedCreateInput & {
	city_id: number;
};

const create_package = async ({
	id,
	name,
	description,
	price,
	currency,
	providerId,
	city_id,
}: PackageSeed) => {
	const data = await prisma.package.upsert({
		where: {
			id: id,
		},
		update: {},
		create: {
			name: name,
			description: description,
			price: price,
			currency: currency,
			provider: {
				connect: {
					id: providerId,
				},
			},
			cities: {
				connect: {
					id: city_id,
				},
			},
		},
	});

	return data;
};

type BookingSeed = Prisma.BookingUncheckedCreateInput;
const create_booking = async ({
	id,
	bookingStartDate,
	bookingEndDate,
	customerId,
	roomId,
	packageId,
}: BookingSeed) => {
	const between_dates = faker.date.betweens({
		from: bookingStartDate,
		to: bookingEndDate,
		count: 2,
	});

	const data = await prisma.booking.upsert({
		where: {
			id: id,
		},
		update: {},
		create: {
			bookingStartDate: between_dates[0],
			bookingEndDate: between_dates[1],
			customerId: customerId,
			roomId: roomId,
			packageId: packageId,
		},
	});

	return data;
};

async function main() {
	// Erstellen von Testdaten für Städte
	for (let i = 0; i < STAEDTE.length; i++) {
		const stadt = STAEDTE[i];
		const created_stadt = await create_stadt({ name: stadt, id: i + 1 });

		if (created_stadt) {
			console.log(`Created stadt with id: ${created_stadt.id}`);
		}

		// Erstellen von Testdaten für Hotels
		const created_hotel = await create_hotel({
			name: `${faker.company.name()} Hotel`,
			address: faker.location.streetAddress(),
			taxId: faker.finance.routingNumber(),
			id: i + 1,
			cityId: created_stadt.id,
		});

		if (created_hotel) {
			console.log(`Created hotel with id: ${created_hotel.id}`);
		}

		// Erstellen von Testdaten für Zimmer
		const created_room = await create_room({
			id: i + 1,
			hotelId: created_hotel.id,
			number: i + 1,
			roomType: ROOM_TYPES[Math.floor(Math.random() * ROOM_TYPES.length)],
			price: faker.number.float({ min: 50, max: 500, precision: 0.01 }),
			currency: 'EUR',
		});

		if (created_room) {
			console.log(`Created room with id: ${created_hotel.id}`);
		}

		// Erstellen von Testdaten für Kunden
		const created_customer = await create_customer({
			name: faker.person.fullName(),
			address: faker.location.streetAddress(),
			email: faker.internet.email(),
			id: i + 1,
		});

		if (created_customer) {
			console.log(`Created customer with id: ${created_customer.id}`);
		}

		//Erstellen von Testdaten für Providers
		const created_provider = await create_provider({
			id: i + 1,
			name: faker.company.name(),
			address: faker.location.streetAddress(),
			taxId: faker.finance.routingNumber(),
		});

		if (created_provider) {
			console.log(`Created provider with id: ${created_provider.id}`);
		}

		//Erstellen von Testdaten für Packages
		const created_package = await create_package({
			id: i + 1,
			name: faker.commerce.productName(),
			description: faker.commerce.productDescription(),
			price: faker.number.float({
				min: 15,
				max: 200,
				precision: 0.01,
			}),
			currency: 'EUR',
			city_id: created_stadt.id,
			providerId: created_provider.id,
		});

		if (created_package) {
			console.log(`Created package with id: ${created_package.id}`);
		}

		// Erstellen von Testdaten für Buchungen
		const created_booking = await create_booking({
			id: i + 1,
			bookingStartDate: faker.date.soon(),
			bookingEndDate: faker.date.future(),
			customerId: created_customer.id,
			roomId: created_room.id,
			packageId: created_package.id,
		});

		if (created_booking) {
			console.log(`Created booking with id: ${created_booking.id}`);
		}
	}

	console.log('Seed data created successfully');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})

	.catch(async (e) => {
		console.error(e);

		await prisma.$disconnect();

		process.exit(1);
	});
