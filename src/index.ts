import express, { NextFunction, Request, Response } from 'express';
import { ResponseError } from 'src/utils/errorHandler';

import app from './routes';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const globalErrorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_next: NextFunction
): Response => {
	if (err instanceof ResponseError) {
		return res.status(err?.status ?? 500).json({
			error: {
				message: err?.message ?? 'Internal Server Error'
			}
		});
	}

	return res.status(500).json({
		error: {
			message: err.message ?? 'Internal Server Error'
		}
	});
};

app.use(globalErrorHandler);
app.listen(4000, () => {
	console.log('Express server is running on port 4000');
});
