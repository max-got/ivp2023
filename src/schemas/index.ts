import { RoomType } from '@prisma/client';
import { z } from 'zod';

export const idParamSchema = z.object({
	id: z.coerce.number()
});

export const roomTypeSchema = z.nativeEnum(RoomType);
export type RoomTypeSchema = z.infer<typeof roomTypeSchema>;

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

		if (val.startDate && val.endDate && val.startDate > val.endDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'startDate must be before endDate',
				path: ['startDate', 'endDate']
			});
		}
	});

export type DateQuerySchema = z.infer<typeof dateQuerySchema>;
