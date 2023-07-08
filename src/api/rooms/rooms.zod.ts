import { roomTypeSchema, idParamSchema, dateQuerySchema } from 'src/schemas';
import z from 'zod';

export const roomTypeParamSchema = z.object({
	roomType: roomTypeSchema
});

export { idParamSchema, dateQuerySchema };
