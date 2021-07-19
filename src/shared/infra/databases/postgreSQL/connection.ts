/* eslint-disable no-console */
import { Pool } from 'pg';

import { AppError } from '@shared/errors/AppError';

export function connection(name?: string): { pool: Pool } {
  if (
    !process.env.POSTGRESQL_APPLICATION_NAME ||
    !process.env.POSTGRESQL_HOST ||
    !process.env.POSTGRESQL_DATABASE ||
    !process.env.POSTGRESQL_PORT ||
    !process.env.POSTGRESQL_USER ||
    !process.env.POSTGRESQL_PASSWORD ||
    !process.env.POSTGRESQL_MAX ||
    !process.env.POSTGRESQL_CONNECTION_TIMEOUT_MILLIS ||
    !process.env.POSTGRESQL_IDLE_TIMEOUT_MILLIS
  ) {
    throw new AppError('Environment variables are missing.', 500);
  }

  try {
    const pool = new Pool({
      application_name: process.env.POSTGRESQL_APPLICATION_NAME,
      host: process.env.POSTGRESQL_HOST,
      database: process.env.POSTGRESQL_DATABASE,
      port: Number(process.env.POSTGRESQL_PORT),
      user: process.env.POSTGRESQL_USER,
      password: process.env.POSTGRESQL_PASSWORD,
      max: Number(process.env.POSTGRESQL_MAX),
      connectionTimeoutMillis: Number(
        process.env.POSTGRESQL_CONNECTION_TIMEOUT_MILLIS,
      ),
      idleTimeoutMillis: Number(process.env.POSTGRESQL_IDLE_TIMEOUT_MILLIS),
    });

    console.log(
      `[PostgreSQL<Goomer Lista Rango DB>]${
        name ? ` ${name} - ` : ' '
      }Pool connect.`,
    );

    return { pool };
  } catch (error) {
    console.log(
      `[PostgreSQL<Goomer Lista Rango DB>]${
        name ? ` ${name} - ` : ' '
      }Failed to pool connect.`,
    );
    throw new AppError(
      'Failed to connect to database, try again.',
      500,
      'db.failed.connect',
    );
  }
}
