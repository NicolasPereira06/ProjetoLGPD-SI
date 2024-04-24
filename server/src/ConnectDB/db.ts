import { Pool } from "pg";

const DB = new Pool({
    connectionString: "postgres://eselnnbi:Y2A8hLXEgx-ANvESO-Oxrdv6adA_4xBx@isabelle.db.elephantsql.com/eselnnbi"
});

export default DB;