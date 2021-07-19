import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
});
