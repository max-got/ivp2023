import express from 'express';
const city_routes = express.Router();

import * as cities_controller from './cities.controller';

// Get all Cities
city_routes.get(
	// #swagger.description = 'Get all Cities'
	'/',
	cities_controller.getAllCities
);

export default city_routes;
