import express from 'express';

import swaggerAutogen from 'swagger-autogen';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from 'src/swagger/swagger_output.json';
import { filesInDirArray, outputFile } from 'src/swagger/generator';
import doc from 'src/swagger/doc';

import rooms_routes from 'src/api/rooms/rooms.routes';

const app = express();

swaggerAutogen({ language: 'de-DE' })(outputFile, filesInDirArray, doc);

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
export default app;
