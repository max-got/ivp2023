import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { processRequest } from 'zod-express-middleware';

type ZodExpressRequest = {
	body?: z.ZodTypeAny;
	query?: z.ZodTypeAny;
	params?: z.ZodTypeAny;
};

interface ParsingError {
	fields: string;
	message: string;
}

type ParsingErrorResponse = {
	body: ParsingError[] | null;
	query: ParsingError[] | null;
	params: ParsingError[] | null;
};

export function zodMiddlewareValidator(schema: ZodExpressRequest) {
	return (req: Request, res: Response, next: NextFunction) => {
		const parsing_errors: ParsingErrorResponse = {
			body: null,
			query: null,
			params: null
		};

		if (schema.body) {
			const parsed_body = schema.body.safeParse(req.body);
			if (!parsed_body.success) {
				const errors = parsed_body.error.issues.map((issue) => {
					const path = issue.path.join(', ');
					return { fields: path, message: issue.message };
				});
				parsing_errors.body = errors;
			}
		}
		if (schema.query) {
			const parsed_query = schema.query.safeParse(req.query);
			if (!parsed_query.success) {
				const errors = parsed_query.error.issues.map((issue) => {
					const path = issue.path.join(', ');
					return { fields: path, message: issue.message };
				});

				parsing_errors.query = errors;
			}
		}

		if (schema.params) {
			console.log('schema.params', req.params);
			const parsed_params = schema.params.safeParse(req.params);
			if (!parsed_params.success) {
				const errors = parsed_params.error.issues.map((issue) => {
					const path = issue.path.join(', ');
					return { fields: path, message: issue.message };
				});

				parsing_errors.params = errors;
			}
		}

		if (parsing_errors.body || parsing_errors.query || parsing_errors.params) {
			return res.status(400).json({
				errors: parsing_errors
			});
		}
		const processed = processRequest(schema);
		return processed(req, res, next);
	};
}
