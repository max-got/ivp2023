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
	'Potsdam'
] as const;

const ROOM_TYPES = ['single', 'double', 'suite'] as const;

type StadtSeed = Prisma.CityUncheckedCreateInput;
const create_stadt = async ({ name, id }: StadtSeed) => {
	const data = await prisma.city.upsert({
		where: {
			id: id
		},
		update: {},
		create: {
			name: name
		}
	});

	return data;
};

type HotelSeed = Prisma.HotelUncheckedCreateInput;
const create_hotel = async ({ name, id, cityId, taxId, address }: HotelSeed) => {
	const data = await prisma.hotel.upsert({
		where: {
			id: id
		},
		update: {},
		create: {
			name: name,
			address: address,
			taxId,
			city: {
				connect: {
					id: cityId
				}
			}
		}
	});

	return data;
};

type RoomSeed = Prisma.RoomUncheckedCreateInput;
const create_room = async ({ id, hotelId, number, roomType, price, currency }: RoomSeed) => {
	const data = await prisma.room.upsert({
		where: {
			id: id
		},
		update: {},
		create: {
			number: number,
			roomType: roomType,
			price: price,
			currency: currency,
			hotel: {
				connect: {
					id: hotelId
				}
			}
		}
	});

	return data;
};

type CustomerSeed = Prisma.CustomerUncheckedCreateInput;
const create_customer = async ({ id, name, email, address }: CustomerSeed) => {
	const data = await prisma.customer.upsert({
		where: {
			id: id
		},
		update: {},
		create: {
			name: name,
			email: email,
			address: address
		}
	});

	return data;
};

type ProviderSeed = Prisma.ProviderUncheckedCreateInput;
const create_provider = async ({ id, name, address, taxId }: ProviderSeed) => {
	const data = await prisma.provider.upsert({
		where: {
			id: id
		},
		update: {},
		create: {
			name: name,
			address: address,
			taxId: taxId
		}
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
	city_id
}: PackageSeed) => {
	const data = await prisma.package.upsert({
		where: {
			id: id
		},
		update: {},
		create: {
			name: name,
			description: description,
			price: price,
			currency: currency,
			provider: {
				connect: {
					id: providerId
				}
			},
			cities: {
				connect: {
					id: city_id
				}
			}
		}
	});

	return data;
};

type BookingSeed = Prisma.BookingUncheckedCreateInput;
const create_booking = async ({
	id,
	startDate,
	endDate,
	customerId,
	roomId,
	packageId
}: BookingSeed) => {
	const data = await prisma.booking.upsert({
		where: {
			id: id
		},
		update: {},
		create: {
			startDate: startDate,
			endDate: endDate,
			customerId: customerId,
			roomId: roomId,
			packageId: packageId
		}
	});

	return data;
};

async function main() {
	console.log(`Start seeding ..., one moment please`);
	console.log(`Seeding ...`);
	// Erstellen von Testdaten für Städte
	const created_staedte: Prisma.CityUncheckedCreateInput[] = [];
	for (let i = 0; i < STAEDTE.length; i++) {
		const stadt = STAEDTE[i];
		const created_stadt = await create_stadt({ name: stadt, id: i + 1 });

		created_staedte.push(created_stadt);

		if (created_stadt) {
			console.log(`Created stadt with id: ${created_stadt.id} (${created_stadt.name})`);
		}
	}
	console.log(`Created ${created_staedte.length} staedte`);
	console.log(`\nstill Seeding ...`);

	for (let i = 0; i < 200; i++) {
		const stadt = STAEDTE[Math.floor(Math.random() * STAEDTE.length)];
		const created_stadt = created_staedte.find(
			(s) => s.name === stadt
		) as Prisma.CityUncheckedCreateInput;

		// Erstellen von Testdaten für Hotels
		const created_hotel = await create_hotel({
			name: `${faker.company.name()} Hotel`,
			address: faker.location.streetAddress(),
			taxId: faker.finance.routingNumber(),
			id: i + 1,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			cityId: created_stadt.id!
		});

		// Erstellen von Testdaten für Zimmer
		const created_room = await create_room({
			id: i + 1,
			hotelId: created_hotel.id,
			number: faker.number.int({ min: 50, max: 999 }),
			roomType: ROOM_TYPES[Math.floor(Math.random() * ROOM_TYPES.length)],
			price: faker.number.float({ min: 50, max: 500, precision: 0.01 }),
			currency: 'EUR'
		});

		// Erstellen von Testdaten für Kunden
		const created_customer = await create_customer({
			name: faker.person.fullName(),
			address: faker.location.streetAddress(),
			email: faker.internet.email(),
			id: i + 1
		});

		//Erstellen von Testdaten für Providers
		const created_provider = await create_provider({
			id: i + 1,
			name: faker.company.name(),
			address: faker.location.streetAddress(),
			taxId: faker.finance.routingNumber()
		});

		//Erstellen von Testdaten für Packages
		const created_package = await create_package({
			id: i + 1,
			name: faker.commerce.productName(),
			description: faker.commerce.productDescription(),
			price: faker.number.float({
				min: 15,
				max: 200,
				precision: 0.01
			}),
			currency: 'EUR',
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			city_id: created_stadt.id!,
			providerId: created_provider.id
		});

		// Erstellen von Testdaten für Buchungen
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const created_booking = await create_booking({
			id: i + 1,
			startDate: faker.date.past({ refDate: new Date() }),
			endDate: faker.date.soon({ refDate: new Date() }),
			customerId: created_customer.id,
			roomId: created_room.id,
			packageId: created_package.id
		});
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
		console.log('\n\nDisconnected from database');
		console.log('\x1b[32mCreated Data for Testing successfully!!\x1b[0m');
		console.log('\x1b[32mYou can now start the server with `npm run dev`\x1b[0m');
		console.log(
			'If you want to see the data in the database, open a new terminal and run the following command:\n\x1b[36mnpx prisma studio\x1b[0m \n\n'
		);
	})

	.catch(async (e) => {
		console.error(e);

		await prisma.$disconnect();

		process.exit(1);
	});
