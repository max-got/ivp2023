import { roomTypeSchema, idParamSchema } from 'src/schemas';
import z from 'zod';

export const dateQuerySchema = z
	.object({
		startDate: z.coerce.date().optional(),
		endDate: z.coerce.date().optional()
	})
	.superRefine((val, ctx) => {
		if (val.startDate && !val.endDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'endDate is required if startDate is provided',
				path: ['endDate']
			});
		}

		if (val.endDate && !val.startDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'startDate is required if endDate is provided',
				path: ['startDate']
			});
		}
	});

export const roomTypeParamSchema = z.object({
	roomType: roomTypeSchema
});

export { idParamSchema };
