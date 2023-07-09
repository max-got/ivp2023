import { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { processRequest } from 'zod-express-middleware';

type ParsingErrorResponse = {
	body?: { fields: string; message: string }[];
	query?: { fields: string; message: string }[];
	params?: { fields: string; message: string }[];
};

export function zodMiddlewareValidator<
	T extends ZodTypeAny,
	K extends ZodTypeAny,
	S extends ZodTypeAny
>({
	bodySchema,
	querySchema,
	paramsSchema
}: { bodySchema?: T; querySchema?: K; paramsSchema?: S } = {}) {
	return (req: Request, res: Response, next: NextFunction) => {
		const parsing_errors: ParsingErrorResponse = {};

		if (bodySchema) {
			const parsed_body = bodySchema.safeParse(req.body);
			if (!parsed_body.success) {
				const errors = parsed_body.error.issues.map((issue) => {
					const fields = issue.path.join(', ');
					return { fields, message: issue.message };
				});
				parsing_errors.body = errors;
			}
		}

		if (querySchema) {
			const parsed_query = querySchema.safeParse(req.query);
			if (!parsed_query.success) {
				console.log(parsed_query.error.flatten());
				const errors = parsed_query.error.issues.map((issue) => {
					const fields = issue.path.join(', ');
					return { fields, message: issue.message };
				});
				parsing_errors.query = errors;
			}
		}

		if (paramsSchema) {
			const parsed_params = paramsSchema.safeParse(req.params);
			if (!parsed_params.success) {
				const errors = parsed_params.error.issues.map((issue) => {
					const fields = issue.path.join(', ');
					return { fields, message: issue.message };
				});
				parsing_errors.params = errors;
			}
		}

		if (parsing_errors.body || parsing_errors.query || parsing_errors.params) {
			return res.status(400).json({
				errors: parsing_errors
			});
		}

		const processed = processRequest({
			body: bodySchema,
			query: querySchema,
			params: paramsSchema
		});
		return processed(req, res, next);
	};
}
