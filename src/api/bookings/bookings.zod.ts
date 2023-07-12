import { roomTypeSchema, idParamSchema } from 'src/schemas';
import z from 'zod';

export const dateQuerySchemaRequired = z.object({
	startDate: z.coerce.date({
		required_error: 'startDate is required'
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
export const check_multiple_rooms_by_ids_query_schema = z
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
	});

//Check if multiple Rooms by roomType are available
export const check_multiple_rooms_by_roomType_query_schema = z
	.object({
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
	});

// Check if multiple Rooms by city id are available
export const check_multiple_rooms_by_cityId_query_schema = z
	.object({
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
	});

export const create_booking_single_room_schema_full = z
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
	});

export { idParamSchema, roomTypeSchema };
