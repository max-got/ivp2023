const doc = {
	info: {
		version: '', // by default: '1.0.0'
		title: 'IVP2023', // by default: 'REST API'
		description: 'Documentation for the IVP2023 API' // by default: ''
	},
	host: 'localhost:4000', // by default: 'localhost:3000'
	basePath: '/', // by default: '/'
	schemes: ['http'], // by default: ['http']
	consumes: ['application/json'], // by default: ['application/json']
	produces: ['application/json'], // by default: ['application/json']
	tags: [
		// by default: empty Array
	],
	definitions: {}, // by default: empty object (Swagger 2.0)
	components: {} // by default: empty object (OpenAPI 3.x)
} as const;

export default doc;
