import { RoomType } from '@prisma/client';
import { z } from 'zod';

export const idParamSchema = z.object({
	id: z.coerce.number(),
});

export const roomTypeSchema = z.nativeEnum(RoomType);
export type RoomTypeSchema = z.infer<typeof roomTypeSchema>;
