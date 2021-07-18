/* eslint-disable no-console */
import { Pool } from 'pg';

import { AppError } from '@shared/errors/AppError';

export function connection(name?: string): { pool: Pool } {
  try {
    const pool = new Pool({
      application_name: 'postgres',
      host: 'goomerListaRangoDB_development',
      database: 'goomer_lista_rango',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
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
