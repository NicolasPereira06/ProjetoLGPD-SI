import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configurações do primeiro banco de dados
const DB = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

// Configurações do segundo banco de dados
const DBKey = new Pool({
  connectionString: process.env.DB_KEY_CONNECTION_STRING,
});

export { DB, DBKey };
