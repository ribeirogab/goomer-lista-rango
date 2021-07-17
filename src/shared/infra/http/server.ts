import 'reflect-metadata';
import 'express-async-errors';
import '@shared/container';

import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';

import { AppError } from '@shared/errors/AppError';

import { routes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use((error: Error, req: Request, res: Response, _: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      ...(error?.errorCode ? { code: error.errorCode } : {}),
    });
  }

  console.log(error); // eslint-disable-line no-console

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
});

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running.');
});
