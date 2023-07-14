import express from 'express';
const roomTypes_routes = express.Router();

import * as roomTypes_controller from './roomTypes.controller';

// Get all Cities
roomTypes_routes.get(
	// #swagger.description = 'Get all RoomTypes'
	'/',
	roomTypes_controller.getAllRoomTypes
);

export default roomTypes_routes;
