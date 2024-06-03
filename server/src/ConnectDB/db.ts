import { Pool } from 'pg';

// Configurações do primeiro banco de dados
const DB = new Pool({
  connectionString: 'postgres://sfnrsfac:HEN6Pe--qX857xZ5CR6j3Bqp7JLxFmsE@isabelle.db.elephantsql.com/sfnrsfac',
});

// Configurações do segundo banco de dados
const DBKey = new Pool({
  connectionString: 'postgres://hgqxjaah:GmHy972bfwfW5-17BEdDkVvWbBbH14xr@isabelle.db.elephantsql.com/hgqxjaah',
});

export { DB, DBKey };
