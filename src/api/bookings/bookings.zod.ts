import { roomTypeSchema, idParamSchema } from 'src/schemas';
import z from 'zod';
import { roomTypeParamSchema } from '../rooms/rooms.zod';

export const dateQuerySchemaRequired = z.object({
	startDate: z.coerce
		.date({
			required_error: 'startDate is required'
		})
		.min(new Date(new Date().setUTCHours(0, 0, 0, 0)), {
			message: 'startDate must be after today'
		}),
	endDate: z.coerce.date({
		required_error: 'endDate is required'
	})
});

export const multipleIdsParamSchema = z.object({
	//ids are comma separated numbers
	//e.g: 1,2,3
	ids: z
		.string()
		.trim()
		.regex(/^[0-9]+(,[0-9]+)*$/, {
			message: 'ids must be comma separated numbers'
		})
		.refine((val) => {
			const ids = val.split(',').map(Number);
			if (ids.some((id) => isNaN(id))) {
				return false;
			}
			if (ids.some((id) => id < 1)) {
				return false;
			}
			return true;
		})
});

//Check if multiple Rooms by ids are available
export const findManyCheckIfRoomsByIdsAreAvailable = {
	querySchema: z
		.object({
			...multipleIdsParamSchema.shape,
			...dateQuerySchemaRequired.shape
		})
		.superRefine((val, ctx) => {
			if (val.startDate && val.endDate && val.startDate > val.endDate) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'startDate must be before endDate',
					path: ['startDate', 'endDate']
				});
			}
		})
};

//Check if multiple Rooms by roomType are available
export const findManyRoomsByRoomtypeThatAreAvailable = {
	paramsSchema: z.object({
		roomType: roomTypeSchema
	}),

	querySchema: z
		.object({
			...dateQuerySchemaRequired.shape,
			cityName: z.string().trim().optional(),
			hotelName: z.string().trim().optional()
		})
		.superRefine((val, ctx) => {
			if (val.startDate && val.endDate && val.startDate > val.endDate) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'startDate must be before endDate',
					path: ['startDate', 'endDate']
				});
			}
		})
};

// Check if multiple Rooms by city id are available
export const roomsByCitynameThatAreAvailable = {
	querySchema: z
		.object({
			...dateQuerySchemaRequired.shape,
			roomType: roomTypeParamSchema.shape.roomType.optional(),
			hotelName: z.string().trim().optional()
		})
		.superRefine((val, ctx) => {
			if (val.startDate && val.endDate && val.startDate > val.endDate) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'startDate must be before endDate',
					path: ['startDate', 'endDate']
				});
			}
		}),
	paramsSchema: z.object({
		cityName: z.string().trim().nonempty()
	})
};

export const createSingleRoomBookingById = {
	paramsSchema: z.object({
		roomId: z.coerce.number().int().positive()
	}),
	bodySchema: z
		.object({
			customerId: z.coerce.number().int().positive().optional(),
			name: z.string().trim().nonempty().optional(),
			email: z.string().trim().email().optional(),
			address: z.string().trim().nonempty().optional(),
			...dateQuerySchemaRequired.shape
		})
		.superRefine((val, ctx) => {
			//customerId OR name AND email AND address are required
			if (!val.customerId && !(val.name && val.email && val.address)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'customerId OR name AND email AND address are required',
					path: ['customerId', 'name', 'email', 'address']
				});
			}

			if (val.startDate && val.endDate && val.startDate > val.endDate) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'startDate must be before endDate',
					path: ['startDate', 'endDate']
				});
			}
		})
};

export { idParamSchema, roomTypeSchema };
