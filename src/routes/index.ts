import express from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerFile from 'src/swagger/swagger_output.json';

import rooms_routes from 'src/api/rooms/rooms.routes';
import hotels_routes from 'src/api/hotels/hotels.routes';
import bookings_routes from 'src/api/bookings/bookings.routes';

const app = express();

//docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get('/health', async (_, res) => {
	// #swagger.ignore = true
	res.status(200).json({ message: 'OK' });
});

app.use(
	// #swagger.tags = ['Rooms']
	'/api/rooms',
	rooms_routes
);

app.use(
	'/api/hotels',
	// #swagger.tags = ['Hotels']
	hotels_routes
);

app.use(
	'/api/bookings',
	// #swagger.tags = ['Bookings']
	bookings_routes
);

export default app;
