import { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';
import { processRequest } from 'zod-express-middleware';

export type zodMiddlewareValidatorArgs = {
	paramsSchema?: z.ZodTypeAny;
	querySchema?: z.ZodTypeAny;
	bodySchema?: z.ZodTypeAny;
};

type ParsingErrorResponse = {
	body?: { fields: string; message: string }[];
	query?: { fields: string; message: string }[];
	params?: { fields: string; message: string }[];
};

export function zodMiddlewareValidator({
	bodySchema,
	querySchema,
	paramsSchema
}: zodMiddlewareValidatorArgs = {}) {
	return (req: Request, res: Response, next: NextFunction) => {
		const parsing_errors: ParsingErrorResponse = {};
		console.log('Das sind die Anfragen Parameter ', req.params);
		console.log('Das ist der Anfragen Body ', req.body);
		console.log('Das ist der Anfragen Query ', req.query);
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
		console.log(
			parsing_errors.body || parsing_errors.query || parsing_errors.params
				? `!Anfrage hat folgende Fehler: 

				${JSON.stringify(parsing_errors, null, 2)}`
				: '!Anfrage hat keine Fehler!'
		);

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
