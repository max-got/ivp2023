import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import swaggerAutogen from 'swagger-autogen';
import doc from 'src/swagger/doc';

//get ./routes folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const routes_folder = path.join(__dirname, '../routes');

//get all files in ./routes folder
export const filesInDirArray = [routes_folder + '/index.ts'];

//output file
export const outputFile = path.join(__dirname, './swagger_output.json');

swaggerAutogen({ language: 'de-DE' })(outputFile, filesInDirArray, doc).then(async () => {
	console.log('Swagger JSON file created');
});
